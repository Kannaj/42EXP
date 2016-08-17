import {db,queries} from '../config.js'
import project_list_cleaner from '../utils/project_list_cleaner.js'


export const get_more_messages = function(data,res){
  //console.log('retrieving messages for  : ',data)
  return db.any(queries.GetMoreMessages,[data.projectId,data.lastMessageId])
          .then(function(messages){
            //console.log('got messages : ',messages)
            res(null,messages)
          })
          .catch(function(err){
            //console.log('there was an error : ',err)
            res(err)
          })
}

export const project_check_name = function(data,res){
  return db.one("select name from project where LOWER(name) like LOWER('$1#')",data.name)
            .then(function(name){
              //console.log('name: ',name)
              res(name)
            })
            .catch(function(){
              res(null,'ok')
            })
}

export const project_list = function(data){
  return db.any(queries.ProjectList)
    .then(function(results){
      let newResults = project_list_cleaner(results)
      // res(null,newResults)
      return newResults
    })
    .catch(function(err){
      // res(err)
      // console.log(err)
      console.log(err)
      throw "Couldnt retrieve projects"
    })
}

export const project_detail = function(data){
  return db.one(queries.ProjectDetail,data.id)
    .then(function(result){
      //project_list_cleaner requires an array object.
      let newResult = project_list_cleaner([result])
      // res(null,newResult[0])
      return newResult[0]
    })
    .catch(function(err){
      // res(err)
      // console.log('there was an error : ',err)
      throw "project not found"
    })
}

export const join_project = function(data){
  let result;
  return db.one('insert into account_projects (username,project,role) values ($1,$2,$3) returning *',[data.username,data.project,'member'])
    .then(function(projectDetails){
      result = {
        id: data.id,
        last_activity: projectDetails.last_activity,
        // messages:[],
        project: data.project,
        role: projectDetails.role,
        unread_messages:0
      }
      // res(null,result)
      return db.any('SELECT id,message,username,timestamp FROM project_messages where project=$1',data.project)
        .then(function(data){
          if(data.length >= 1){
              result.messages = data
          }else{
            result.messages = []
          }
          // res(null,result)
          return(result)
        })
    })
    .catch(function(err){
      throw 'Couldnt join Project'
    })
}

export const update_last_activity = function(data,res){
  //console.log('data: ',data)
  return db.one('update account_projects set last_activity = Now() where username=$1 AND project=(SELECT name from project where id = $2) returning last_activity',
    [this.getAuthToken().username,data.id]
  )
  .then(function(result){
    //console.log('changed: ',result)
    res(null,{last_activity:result.last_activity})
  })
  .catch(function(err){
    //console.log('error : ',err)
    res('couldnt update last timestamp')
  })

}

export const createNewProject = (data) => {
  return db.tx((t) => {
  return t.one("insert into project (name,category,description,link,owner) values (${name},${category},${description},${link},${username}) returning *",data)
          .then(function(project){
            return t.one('insert into account_projects (username,project,role) values ($1,$2,$3) returning *',[data.username,project.name,'owner'])

          .then(function(accountProjects){
            if(data.skill.length > 0){
              const queries = data.skill.map(function(skill){
                return t.one("insert into project_skills (project,skill) values ($1,$2) returning *",[project.name,skill.value])
              })
              return t.batch(queries)
                      .then(function(projectSkills){
                        return {'project':project,'accountProjects':accountProjects,'projectSkills':projectSkills}
                      })
            }else{
              return {'project':project,'accountProjects':accountProjects}
            }
          })
        })
      })
  .then(function(details){
    return {
      id:details.project.id,
      last_activity: details.accountProjects.last_activity,
      messages:[],
      unread_messages:0,
      project: details.project.name,
      role: details.accountProjects.role,
    }
  })
  .catch(function(err){
    // console.log('there was an error :',err)
    throw "Unable to create your project"
  })
}

export const edit_project = function(data,res){
  //console.log('recieved project to edit: ',data)
  editProject(data)
    .then(function(result){
      res(null,result)
    })
    .catch(function(err){
      res('Couldnt edit project')
    })
}

const editProject = (data) => {
  // console.log('editProject hit with :',data)
  return db.tx((t) => {
    return t.any('DELETE from project_skills WHERE project = (SELECT name from project where id = $1) returning *',[data.id])
            .then(function(deletedSkills){
              // console.log('the following skills were deleted : ',deletedSkills)
              return t.one('update project set name=$1,description=$2,link=$3,category=$4 where id=$5 returning *',
              [data.project.name,data.project.description,data.project.link,data.project.category.value,data.id])
                        .then(function(updatedProject){
                          // console.log('updatedProject : ',updatedProject)
                          if(data.project.skill.length > 0){
                            const queries = data.project.skill.map(function(skill){
                              return t.one("insert into project_skills (project,skill) values ($1,$2) returning *",[updatedProject.name,skill.value])
                            })
                            return t.batch(queries)
                                    .then(function(projectSkills){
                                      console.log('skills updated : ',projectSkills)
                                      return {'project':updatedProject,'skills':projectSkills}
                                    })
                          }else{
                            return {'project':updatedProject}
                          }
                        })
            })
  })
  .then(function(details){
    // console.log('updated project with : ',details)
    return {
      id: details.project.id,
      project: details.project.name
    }
  })
  .catch(function(err){
    // console.log('there was an error: ',err)
    return (err)
  })
}

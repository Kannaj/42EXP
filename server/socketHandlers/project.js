import {db,queries} from '../config.js'
import project_list_cleaner from '../utils/project_list_cleaner.js'
import winston from 'winston';

export const get_more_messages = function(data,res){
  return db.any(queries.GetMoreMessages,[data.projectId,data.lastMessageId])
          .then(function(messages){
            res(null,messages)
          })
          .catch(function(err){
            winston.error('Error retrieving old messages : ',err)
            res('error retrieving messages')
          })
}

export const get_messages = function(data,res){
  return db.any(queries.getMessages,data.projectId)
            .then(function(messages){
              res(null,messages.reverse())
            })
            .catch(function(err){
              winstor.error('Error retrieving messages : ',err)
              res('Error retrieving messages')
            })
}

export const project_check_name = function(data,res){
  return db.one("select name from project where LOWER(name) like LOWER('$1#')",data.name)
            .then(function(name){
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
      return newResults
    })
    .catch(function(err){
      winston.error('Project_list cant be retrieved : ',err)
      throw "Couldnt retrieve projects"
    })
}

export const project_detail = function(data){
  return db.one(queries.ProjectDetail,data.id)
    .then(function(result){
      let newResult = project_list_cleaner([result])
      return newResult[0]
    })
    .catch(function(err){
      winston.error('project detail cant be retrieved : ',err, ' : data  -',data)
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
        project: data.project,
        role: projectDetails.role,
        unread_messages:0
      }
      return db.any('SELECT id,message,username,timestamp FROM project_messages where project=$1',data.project)
        .then(function(data){
          if(data.length >= 1){
              result.messages = data
          }else{
            result.messages = []
          }
          return(result)
        })
    })
    .catch(function(err){
      winston.error('User cant join project : ',err, ' data: ',data)
      throw 'Couldnt join Project'
    })
}

export const update_last_activity = function(data,res){
  return db.one('update account_projects set last_activity = Now() where username=$1 AND project=(SELECT name from project where id = $2) returning last_activity',
    [this.getAuthToken().username,data.id]
  )
  .then(function(result){
    res(null,{last_activity:result.last_activity})
  })
  .catch(function(err){
    winston.error('Couldnt update last_activity: ',err, ' data: ',data)
    res('couldnt update last timestamp')
  })

}

export const createNewProject = (data) => {
  return db.tx((t) => {
  return t.one("insert into project (name,category,description,github_link,reddit_link,owner) values (${name},${category},${description},${github_link},${reddit_link},${username}) returning *",data)
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
    winston.info('Project created : ',details)
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
    winston.error('Cant create a project : ',err, ' data: ',data)
    throw "Unable to create your project"
  })
}

export const edit_project = function(data,res){
  editProject(data)
    .then(function(result){
      res(null,result)
    })
    .catch(function(err){
      res('Couldnt edit project')
      winston.error('User cant edit project : ',err,' data : ',data)
    })
}

const editProject = (data) => {
  return db.tx((t) => {
    return t.any('DELETE from project_skills WHERE project = (SELECT name from project where id = $1) returning *',[data.id])
            .then(function(deletedSkills){
              return t.one('update project set name=$1,description=$2,github_link=$3,reddit_link=$4,category=$5 where id=$6 returning *',
              [data.project.name,data.project.description,data.project.github_link,data.project.reddit_link,data.project.category.value,data.id])
                        .then(function(updatedProject){
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
    return {
      id: details.project.id,
      project: details.project.name
    }
  })
  .catch(function(err){
    return (err)
  })
}

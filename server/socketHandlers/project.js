import {db,queries} from '../config.js'
import project_list_cleaner from '../utils/project_list_cleaner.js'

export const create_project = function(data,res){
  console.log('recieved data : ',data)
  data.username = this.getAuthToken().username
  createNewProject(data)
    .then(function(details){
      console.log('***details of transaction ***\n')
      console.log(details)
      res(null,details)
    })
    .catch(function(err){
      console.log('***there was an error****\n')
      console.log(err)
      res(err)
    })
}

export const project_list = function(data,res){
  console.log('retrieving projects....')
  db.any(queries.ProjectList)
    .then(function(results){
      let newResults = project_list_cleaner(results)
      console.log('cleansed results : ',newResults)
      res(null,newResults)
    })
    .catch(function(err){
      res(err)
    })
}

export const project_detail = function(data,res){
  console.log('recieved id: ',data.id)
  db.one(queries.ProjectDetail,data.id)
    .then(function(result){
      console.log('result of project_detail: ',result)
      let newResult = project_list_cleaner([result])
      res(null,newResult[0])
    })
    .catch(function(err){
      res(err)
    })
}

const createNewProject = (data) => {
  return db.tx((t) => {
  return t.one("insert into project (name,category,description,link,owner) values (${name},${category},${description},${link},${username}) returning *",data)
          .then(function(project){
            console.log('project created : ',project)
            return t.one('insert into account_projects (username,project,role) values ($1,$2,$3) returning *',[data.username,project.name,'owner'])

          .then(function(accountProjects){
            console.log('account project created: ',accountProjects)
            if(data.skill.length > 0){
              const queries = data.skill.map(function(skill){
                return t.one("insert into project_skills (project,skill) values ($1,$2) returning *",[project.name,skill.value])
              })
              return t.batch(queries)
                      .then(function(projectSkills){
                        console.log('project skills add: ',projectSkills)
                        return {'project':project,'accountProjects':accountProjects,'projectSkills':projectSkills}
                      })
            }else{
              return {'project':project,'accountProjects':accountProjects}
            }
          })
        })
      })
  .then(function(details){
    console.log('details after transaction: ',details)
    return {
      id:details.project.id,
      last_activity: details.accountProjects.last_activity,
      messages:[],
      project: details.project.name,
      role: details.accountProjects.role,
    }
  })
  .catch(function(err){
    console.log('There was an error : ',err)
    return (err)
  })
}

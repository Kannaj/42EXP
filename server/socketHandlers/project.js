import { db, queries } from '../config.js'
import project_list_cleaner from '../utils/project_list_cleaner.js'
import winston from 'winston';
import slugify from '../../shared/utils/slugify';

export const get_more_messages = function(data){
  return db.any(queries.GetMoreMessages,[data.projectId,data.lastMessageId])
          .then(function(messages){
            return messages
          })
          .catch(function(err){
            winston.error('Error retrieving old messages : ',err)
            return 'error retrieving messages'
          })
}

export const get_messages = function(data){
  return db.any(queries.GetMessages,data.projectId)
            .then(function(messages){
              return messages.reverse()
            })
            .catch(function(err){
              winstor.error('Error retrieving messages : ',err)
              return "Error retrieving messages"
            })
}

export const new_project_message = function(data){
  return db.one(queries.NewProjectMessage, [data.id,data.message,data.username,data.timestamp])
    .then(function(projectMessageDetails){
      return ''
    })
    .catch(function(err){
      winston.error('Couldnt insert message : ',data,' error: ',err)
      return 'couldnt insert message'
    })
}

export const project_check_name = function(data){
  data = slugify('slugify',data)
  return db.one(queries.ProjectCheckName,data.name)
            .then(function(name){
              return 'project already exists'
            })
            .catch(function(){
              return 'ok'
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
  return db.tx(t => {
    return t.batch([
      t.one(queries.JoinProjectAccountProjects,[data.username,data.project,'member']),
      t.one(queries.JoinProjectMessages,[data.project,`${data.username} has joined`,data.username,"general"])
    ])
  })
  .then(function(projectDetails){
    result = {
          id: data.id,
          last_activity: projectDetails[0].last_activity,
          project: data.project,
          role: projectDetails[0].role,
          unread_messages: 0,
          messages: []
        }
        return {
          result,
          roomMessage: projectDetails[1]
        }
  })
  .catch(function(err){
    winston.error('User cant join project : ',err, ' data: ',data)
    throw 'Couldnt join Project'
  })
}

export const update_last_activity = function(data,username){
  return db.one(queries.UpdateLastActivity,[username,data.id])
  .then(function(result){
    return { last_activity: result.last_activity }
  })
  .catch(function(err){
    winston.error('Couldnt update last_activity: ',err, ' data: ',data)
    return 'Couldnt update last timestamp'
  })
}

export const project_paginate = function(data){
  return db.any(queries.ProjectListPaginate,data.lastId)
    .then(function(result){
      return result
    })
    .catch(function(err){
      winston.error('Problem with project:list_more : ',err)
      return 'Couldnt retrieve more projects'
    })
}

export const project_member_list = function(data){
  return db.any(queries.ProjectMemberList,data.name)
    .then(function(data){
      return data
    })
    .catch(function(err){
      winston.error('Couldnt retrieve member list: ',err)
      return 'Couldnt retrieve member list'
    })
}

export const create_new_project = (data) => {
  return db.tx((t) => {
  return t.one(queries.CreateNewProject,data)
      .then(function(project) {
        return t.one(queries.CreateAccountProjects,[data.username,project.name,'owner'])
      .then(function(accountProjects){
        if (data.skill.length > 0) {
          const queryList = data.skill.map(function(skill) {
            return t.one(queries.CreateProjectSkills,[project.name,skill.value])
          })
          return t.batch(queryList)
            .then(function(projectSkills){
              return {
                'project': project,
                'accountProjects': accountProjects,
                'projectSkills':projectSkills
              }
            })
        } else {
          return {
            'project': project,
            'accountProjects': accountProjects
          }
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

export const edit_project = function(data){
  return editProject(data)
    .then(function(result){
      return result
    })
    .catch(function(err){
      winston.error('User cant edit project : ',err,' data : ',data)
      return 'Couldnt edit project'
    })
}

const editProject = (data) => {
  return db.tx((t) => {
    return t.any(queries.DeleteProjectSkills,[data.id])
      .then(function(deletedSkills){
        return t.one(queries.UpdateProject,[data.project.name,data.project.description,data.project.github_link,data.project.category.value,data.id])
        .then(function(updatedProject) {
          if (data.project.skill.length > 0) {
            const queryList = data.project.skill.map(function(skill){
              return t.one(queries.CreateProjectSkills,[updatedProject.name,skill.value])
            })
            return t.batch(queryList)
              .then(function(projectSkills) {
                return {'project': updatedProject,'skills': projectSkills}
              })
          } else {
            return { 'project': updatedProject }
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

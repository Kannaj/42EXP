import * as constants from '../../actions/projects/constants'


const Projects = (state=[],action) => {
  switch(action.type){
    case constants.CREATE_PROJECT_REQUEST:
      return [
        ...state,
      ]
    case constants.CREATE_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]
      //to-do :errors need to be handled better.
    case constants.CREATE_PROJECT_ERROR:
      return state

    case constants.JOIN_PROJECT_REQUEST:
      return [
        ...state
      ]

    case constants.JOIN_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]

    case constants.JOIN_PROJECT_ERROR:
      return [
        ...state
      ]
  }
  return state
}

export default Projects


/*
API for a project object
id : project_id,
last_activity: last_activity of user in project,
messages:[],
project: name,
role: member or owner
unread_messages: int
*/

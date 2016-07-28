import * as constants from '../../actions/projects/constants'
import update from 'react-addons-update';

const Projects = (state=[],action) => {
  let target;
  switch(action.type){
    // case constants.CREATE_PROJECT_REQUEST:
    //   return [
    //     ...state,
    //   ]
    case constants.CREATE_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]
      //to-do :errors need to be handled better.
    // case constants.CREATE_PROJECT_ERROR:
    //   return state

    // case constants.JOIN_PROJECT_REQUEST:
    //   return [
    //     ...state
    //   ]

    case constants.JOIN_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]

    // case constants.JOIN_PROJECT_ERROR:
    //   return [
    //     ...state
    //   ]

    case constants.NEW_CHAT_MESSAGE:
      console.log('state is : ',state)
      console.log('actionMessageDetails: ',action.messageDetails)
      target = state.findIndex((project) => {
        return project.id == action.messageDetails.id
      });
      return update(state,{
          [target]:{
            messages:{
              $push:[action.messageDetails]
            },
            unread_messages:{
              $apply: function(i){
                return i + 1
              }
            }
          }
      })
    case constants.SET_LAST_ACTIVITY:
      target = state.findIndex((project) => {
        return project.id == action.data.id
      });
      return update(state,{
        [target]:{
          last_activity:{
            $set:action.data.timestamp
          }
        }
      })
    case constants.SET_UNREAD:
      target = state.findIndex((project) => {
        return project.id == action.id
      })
      return update(state,{
        [target]:{
          unread_messages:{
            $set: 0
          }
        }
      })
    // case constants.EDIT_PROJECT_REQUEST:
    //   return [
    //     ...state
    //   ]
    case constants.EDIT_PROJECT_SUCCESS:
      console.log('action is  :',action,' state is : ',state)
      target = state.findIndex((project) => {
        return project.id == action.projectDetails.id
      })
      if (target.project !== action.projectDetails.project){
        return update(state,{
          [target]:{
            project:{
              $set:action.projectDetails.project.name
            }
          }
        })
      }else{
        return [
          ...state
        ]
      }
    // case constants.EDIT_PROJECT_ERROR:
    //   return [
    //     ...state
    //   ]
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

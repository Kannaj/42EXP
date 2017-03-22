import * as constants from '../../actions/projects/constants'
import update from 'react-addons-update';

const Projects = (state=[],action) => {
  let target, canRetrieveMore;
  switch(action.type){
    case constants.CREATE_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]
    case constants.JOIN_PROJECT_SUCCESS:
      return [
        ...state,
        action.projectDetails
      ]
    case constants.NEW_CHAT_MESSAGE:
      target = state.findIndex((project) => {
        return project.id == action.messageDetails.project_id
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
      break;
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
      break;
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
      break;
    case constants.EDIT_PROJECT_SUCCESS:
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
      break;
    case constants.GET_MORE_MESSAGES_SUCCESS:
      target = state.findIndex((project) => {
        return project.id == action.projectId
      })
      // if recievedMessages are length 10 -> can retrieve more in the future
      canRetrieveMore = action.messages.length == 10 ? true : false;

      return update(state,{
        [target]:{
          messages:{
            $unshift:action.messages
          },
          $merge: {canRetrieveMore: canRetrieveMore}
        }
      })
      break;

    case constants.GET_MESSAGES_SUCCESS:
      target = state.findIndex((project) => {
        return project.id == action.projectId
      })
      canRetrieveMore = action.messages.length == 10 ? true : false;
      // first time retrieving project messages in session
      return update(state,{
        [target]:{
          $merge:{messages:action.messages,canRetrieveMore: canRetrieveMore}
        }
      })
    }
  return state
}

export default Projects


/*
API for a project object
id : project_id,
last_activity: last_activity of user in project,
canRetrieveMore: Boolean,
messages:[],
project: name,
role: member or owner
unread_messages: int
*/

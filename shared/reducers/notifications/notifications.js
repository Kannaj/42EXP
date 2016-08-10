import * as constants from '../../actions/notifications/constants'
import update from 'react-addons-update';



const Notifications = (state=[],action) => {
  let target;
  switch(action.type){
    case constants.ADD_NOTIFICATION:
      return [
        ...state,
        action.messageDetails
      ]
    case constants.CLOSE_NOTIFICATION:
      target = state.findIndex((notification) => {
        return notification.id == action.messageId
      })
      return update(state,{
        [target]:{
          unread:{
            $set: false
          }
        }
      })
  }

  return state;
}

export default Notifications;

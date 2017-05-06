import * as constants from '../../actions/notifications/constants';
import update from 'react-addons-update';



const Notifications = (state=[],action) => {
  let target;
  switch(action.type){
    case constants.ADD_NOTIFICATION:
      return [
        action.messageDetails,
        ...state,
      ]
  }

  return state;
}

export default Notifications;

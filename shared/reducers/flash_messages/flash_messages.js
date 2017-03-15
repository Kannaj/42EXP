import * as constants from '../../actions/flash_messages/constants';
import update from 'react-addons-update';


const Flash_messages = (state=[],action) => {
  let target;
  switch(action.type){
    case constants.ADD_MESSAGE:
      return [
        ...state,
        action.messageDetails
      ]
    break;
    case constants.REMOVE_MESSAGE:
      target = state.findIndex((message) => {
        return message.id === action.messageId
      })
      return update(state,{
        $splice: [[target,1]]
      })
      break;
  }
  return state
}

export default Flash_messages;

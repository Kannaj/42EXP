import * as constants from './constants';

const send_message_request = (messageDetails) => {
  console.log('create message request')
  return {
    type: constants.SEND_MESSAGE_REQUEST,
    messageDetails
  }
}

const send_message_success = (messageDetails) => {
  return {
    type:constants.SEND_MESSAGE_SUCCESS,
    messageDetails
  }
}

const send_message_error = (err) => {
  return {
    type: constants.SEND_MESSAGE_ERROR,
    err
  }
}


const send_message =(messageDetails) => {
  console.log('sending message')
  if(socket) {
    return function(dispatch){
      dispatch(send_message_request(messageDetails))
      socket.emit('project:message',messageDetails,function(err,data){
        if(err){
          console.log('error: ',err)
          dispatch(send_message_err(err))
        }else{
          dispatch(send_message_success(data))
        }
      })
    }
  }
}

// the above actions capture the time period from when client sends a message to the channel.
// it could be useful for optimistic ui , on request, i can instantly pass the messageDetails to the client UI as opposed to waiting for it across the network
// How to tackle double message post? send_message_success should automatically populate state before waiting for network. how to deal with double posting (one on ui + 1 from network)

export const new_chat_message = (messageDetails) => {
  return {
    type: constants.NEW_CHAT_MESSAGE,
    messageDetails
  }
}

export default new_chat_message;

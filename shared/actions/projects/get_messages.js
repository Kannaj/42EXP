import {GET_MESSAGES_SUCCESS,GET_MESSAGES} from './constants';

const get_messages_success = (messages,projectId) => {
  return {
    type: GET_MESSAGES_SUCCESS,
    messages,
    projectId
  }
}

const get_messages = (projectId) => {
  return function(dispatch){
    socket.emit('project:get_messages',{projectId},function(err,data){
      if(err){
        console.log(err)
      }else{
        dispatch(get_messages_success(data,projectId))
      }
    })
  }
}

export default get_messages;

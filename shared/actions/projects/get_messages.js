import {GET_MESSAGES_SUCCESS,GET_MESSAGES} from './constants';
import {start_request,stop_request} from '../loader';

const get_messages_success = (messages,projectId) => {
  return {
    type: GET_MESSAGES_SUCCESS,
    messages,
    projectId
  }
}

const get_messages = (projectId) => {
  return function(dispatch){
    dispatch(start_request())
    socket.emit('project:get_messages',{projectId},function(err,data){
      if(err){
        console.log(err)
      }else{
        dispatch(get_messages_success(data,projectId))
        dispatch(stop_request())
      }
    })
  }
}

export default get_messages;

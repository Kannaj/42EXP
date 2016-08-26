import {GET_MORE_MESSAGES_SUCCESS} from './constants';
import {start_request,stop_request} from '../loader'

const get_more_messages_success = (messages,projectId) =>{
  return{
    type: GET_MORE_MESSAGES_SUCCESS,
    messages,
    projectId
  }
}


const get_more_messages = (projectId,lastMessageId) => {
  if(socket){
    return function(dispatch){
      dispatch(start_request())
      socket.emit('project:get_more_messages',{projectId,lastMessageId},function(err,data){
        if(err){
          dispatch(add_notification({id:uuid.v4(),heading:'error',message:'Couldnt get more messages',unread:true,server:false}))
        }else{
          dispatch(get_more_messages_success(data,projectId))
          dispatch(stop_request())
        }
      })
    }
  }
}

export default get_more_messages;

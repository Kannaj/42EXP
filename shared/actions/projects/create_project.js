import * as constants from './constants';
import {push} from 'react-router-redux';
import {new_chat_message} from './project_messages';

import {start_request,stop_request} from '../loader';
import {add_notification} from '../notifications/notifications'
import uuid from 'node-uuid';


const create_project_success = (projectDetails) => {
  return{
    type: constants.CREATE_PROJECT_SUCCESS,
    projectDetails
  }
}

const create_project = (projectDetails) => {
  console.log('arguments of create_project: ',arguments)
  if(socket) {
    console.log('dispatching action : ',projectDetails)
    return function(dispatch){
      dispatch(start_request())
      socket.emit('project:create',projectDetails,function(err,data){
        if(err){
          dispatch(add_notification({id:uuid.v4(),heading:'error',message:'Couldnt create your project',unread:true,server:false}))
        }else{
          dispatch(create_project_success(data))
          dispatch(add_notification({heading:'Info',message:'Your project was created',id: uuid.v4(),unread:true,server:false}))
          dispatch(stop_request())
          socket.subscribe(data.id).watch((data) => {
            dispatch(new_chat_message(data))
          })
          dispatch(push(`/projects/${data.id}/${data.project}`))
        }
      })
    }
  }
}

export default create_project;

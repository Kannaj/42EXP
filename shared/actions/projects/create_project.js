import * as constants from './constants';
import {push} from 'react-router-redux';
import {new_chat_message} from './project_messages';

import {add_notification} from '../notifications/notifications'
import uuid from 'node-uuid';


const create_project_success = (projectDetails) => {
  return{
    type: constants.CREATE_PROJECT_SUCCESS,
    projectDetails
  }
}

const create_project = (projectDetails) => {
  if(socket) {
    return function(dispatch){
      socket.emit('project:create', projectDetails ,function(err,data){
        if(err) {
          dispatch(add_notification({ id:uuid.v4(), heading:'error', message: 'Couldnt create your project', unread: true, server: false }))
        } else {
          dispatch(add_notification({ heading:'Info', message: 'Your project was created', id: uuid.v4(), unread: true, server: false }))
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

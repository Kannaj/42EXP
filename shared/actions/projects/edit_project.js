import * as constants from './constants'
import {push} from 'react-router-redux';
import {start_request,stop_request} from '../loader';
import {add_notification} from '../notifications/notifications';
import uuid from 'node-uuid';

const edit_project_success = (projectDetails) => {
  return {
    type: constants.EDIT_PROJECT_SUCCESS,
    projectDetails
  }
}

const edit_project = (projectDetails) => {
  console.log('editing project')
  if(socket){
    return function(dispatch){
      dispatch(start_request())
      socket.emit('project:edit',projectDetails,function(err,data){
        if(err){
          dispatch(add_notification({id:uuid.v4(),heading:'error',message:'Couldnt Edit your project',unread:true,server:false}))
        }else{
          dispatch(stop_request())
          dispatch(edit_project_success(projectDetails))
          dispatch(push('/projects'))
        }
      })
    }
  }
}

export default edit_project;

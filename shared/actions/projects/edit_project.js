import * as constants from './constants'
import {push} from 'react-router-redux';
import {start_request,stop_request} from '../loader';
import {add_notification} from '../notifications/notifications';
import uuid from 'node-uuid';

// const edit_project_request = (projectDetails) => {
//   return{
//     type: constants.EDIT_PROJECT_REQUEST,
//     projectDetails
//   }
// }


const edit_project_success = (projectDetails) => {
  return {
    type: constants.EDIT_PROJECT_SUCCESS,
    projectDetails
  }
}

//
// const edit_project_error = (err) => {
//   return {
//     type: constants.EDIT_PROJECT_ERROR,
//     err
//   }
// }


const edit_project = (projectDetails) => {
  console.log('editing project')
  if(socket){
    return function(dispatch){

      // dispatch(edit_project_request(projectDetails))
      dispatch(start_request())
      socket.emit('project:edit',projectDetails,function(err,data){
        if(err){
          console.log('there was an error: ',err)
          // dispatch(edit_project_error(err))
          dispatch(add_notification({id:uuid.v4(),heading:'error',message:'Couldnt Edit your project',unread:true,server:false}))
        }else{
          dispatch(stop_request())

          // dispatch could either be done with projectDetails or with data. Going ahead with projectDetails for now.
          dispatch(edit_project_success(projectDetails))

          dispatch(push('/projects'))
        }
      })
    }
  }
}

export default edit_project;

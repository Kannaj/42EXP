import * as constants from './constants';
import {push} from 'react-router-redux';

const create_project_request = (projectDetails) => {
  console.log('create_project_request hit')
  return{
    type: constants.CREATE_PROJECT_REQUEST,
    projectDetails
  }
}

const create_project_success = (projectDetails) => {
  return{
    type: constants.CREATE_PROJECT_SUCCESS,
    projectDetails
  }
}

const create_project_error = (err) => {
  return{
    type:constants.CREATE_PROJECT_ERROR,
    err
  }
}

const create_project = (projectDetails) => {
  console.log('arguments of create_project: ',arguments)
  if(socket) {
    console.log('dispatching action : ',projectDetails)
    return function(dispatch){
      console.log('dispatch of create_project ; ',dispatch)
      dispatch(create_project_request(projectDetails))
      socket.emit('project:create',projectDetails,function(err,data){
        if(err){
          console.log('error : ',err)
          dispatch(create_project_error(err))
        }else{
          console.log('success: ',data)
          dispatch(create_project_success(data))
          socket.subscribe(data.id).watch((data) => {
            dispatch(new_chat_message(data))
          })
          dispatch(push('/projects'))
        }
      })
    }
  }
}

export default create_project;

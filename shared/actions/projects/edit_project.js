import * as constants from './constants'
import {push} from 'react-router-redux';

const edit_project_request = (projectDetails) => {
  return{
    type: constants.EDIT_PROJECT_REQUEST,
    projectDetails
  }
}

const edit_project_success = (projectDetails) => {
  return {
    type: constants.EDIT_PROJECT_SUCCESS,
    projectDetails
  }
}

const edit_project_error = (err) => {
  return {
    type: constants.EDIT_PROJECT_ERROR,
    err
  }
}

const edit_project = (projectDetails) => {
  console.log('editing project')
  if(socket){
    return function(dispatch){
      dispatch(edit_project_request(projectDetails))
      socket.emit('project:edit',projectDetails,function(err,data){
        if(err){
          console.log('there was an error: ',err)
          dispatch(edit_project_error(err))
        }else{
          dispatch(edit_project_success(projectDetails))
          dispatch(push('/projects'))
        }
      })
    }
  }
}

export default edit_project;

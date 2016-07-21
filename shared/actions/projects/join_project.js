import * as constants from './constants';
import {push} from 'react-router-redux';

const join_project_request = (projectDetails) => {
  console.log('join_project_request initiated')
  return{
    type: constants.JOIN_PROJECT_REQUEST,
    projectDetails
  }
}

const join_project_success = (projectDetails) => {
  return {
    type: constants.JOIN_PROJECT_SUCCESS,
    projectDetails
  }
}

const join_project_error = (err) => {
  return {
    type: constants.JOIN_PROJECT_ERROR,
    err
  }
}

const join_project = (projectDetails) => {
  if(socket){
    return function(dispatch){
      dispatch(join_project_request(projectDetails))
      socket.emit('project:join',projectDetails,function(err,res){
        if(err){
          console.log('there was an error: ',err)
          dispatch(join_project_error(err))
        }else{
          console.log('join project success: ')
          dispatch(join_project_success(res))
        }
      })
    }
  }
}

export default join_project;

import * as constants from './constants'

const user_add_skills_request = (skill) => {
  return{
    type: constants.USER_ADD_SKILLS_REQUEST,
    skill
  }
}

const user_add_skills_success = (skill_details) => {
  return{
    type:constants.USER_ADD_SKILLS_SUCCESS,
    skill_details
  }
}


const user_add_skills_error = (err) => {
  return{
    type:constants.USER_ADD_SKILLS_ERR,
    err
  }
}

const user_add_skills = (skill) => {
  if(socket){
    return function(dispatch){
      dispatch(user_add_skills_request(skill))
        socket.emit('skills:user',skill,function(err,data){
          if(err){
            console.log(err)
            dispatch(user_add_skills_error(err))
          }else{
            dispatch(user_add_skills_success(data))
          }
        })
      }
    }
  }

export default user_add_skills;

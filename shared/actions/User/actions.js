import * as constants from './constants'
import {add_notification} from '../notifications/notifications'


// const user_add_skills_request = (skill) => {
//   return{
//     type: constants.USER_ADD_SKILLS_REQUEST,
//     skill
//   }
// }

const user_add_skills_success = (skill_details) => {
  return{
    type:constants.USER_ADD_SKILLS_SUCCESS,
    skill_details
  }
}


// const user_add_skills_error = (err) => {
//   return{
//     type:constants.USER_ADD_SKILLS_ERR,
//     err
//   }
// }

export const update_user_stats = (stats) => {
  return {
    type: constants.UPDATE_USER_STATS,
    stats
  }
}

const user_add_skills = (skill) => {
  if(socket){
    return function(dispatch){
      // dispatch(user_add_skills_request(skill))
        socket.emit('skills:user',skill,function(err,data){
          if(err){
            console.log(err)
            // dispatch(user_add_skills_error(err))
            dispatch(add_notification({id:uuid.v4(),heading:'error',message:'You\"ve already added the skill',unread:true,server:false}))
          }else{
            dispatch(user_add_skills_success(data))
          }
        })
      }
    }
  }

export default user_add_skills;

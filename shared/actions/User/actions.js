import * as constants from './constants'
import {add_notification} from '../notifications/notifications'
import uuid from 'node-uuid';

export const user_add_skills_success = (skill_details) => {
  return{
    type:constants.USER_ADD_SKILLS_SUCCESS,
    skill_details
  }
}

export const update_user_stats = (stats) => {
  return {
    type: constants.UPDATE_USER_STATS,
    stats
  }
}

const user_add_skills = (skill) => {
  if(socket){
    return function(dispatch){
        socket.emit('skills:user',skill,function(err,data){
          if(err){
            dispatch(add_notification({id:uuid.v4(),heading:'error',message:'You\"ve already added the skill',unread:true,server:false}))
          }else{
            dispatch(user_add_skills_success(data))
          }
        })
      }
    }
  }

export default user_add_skills;

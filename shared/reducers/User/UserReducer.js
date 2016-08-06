
import * as constants from '../../actions/User/constants'
import update from 'react-addons-update';

const User = (state={isAuthenticated: false},action ) => {
  switch(action.type){
    // case constants.USER_ADD_SKILLS_REQUEST:
    //   return Object.assign({},state,{
    //     loading: true
    //   })
    case constants.USER_ADD_SKILLS_SUCCESS:
      return update(state,{
        skills:{
          $push:action.skill_details
        }
      })
    // case constants.USER_ADD_SKILLS_ERR:
    //   console.log('there was an error: ',action.err)
    //   return state

    case constants.UPDATE_USER_STATS:
      let target = state.skills.findIndex((skill) => {
        return action.stats.account_skill_id == skill.id
      })
      //action object has the below api = {type:**,stats:{stats:{xp:**,level:**},action_skill_id:**}}
      //To-Do : change api of above action object to something more intuitive
      return update(state,{
        xp:{
          $set:action.stats.stats.xp
        },
        level:{
          $set: action.stats.stats.level
        },
        skills:{
          [target]:{
            commends:{
              $apply : function(i){
                return i + 1
              }
            }
          }
        }
      })
  }
  return state;
}

export default User

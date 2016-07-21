
import * as constants from '../../actions/User/constants'
import update from 'react-addons-update';

const User = (state={isAuthenticated: false},action ) => {
  console.log('User Reducer hit')
  switch(action.type){
    case constants.USER_ADD_SKILLS_REQUEST:
      return Object.assign({},state,{
        loading: true
      })
    case constants.USER_ADD_SKILLS_SUCCESS:
      console.log(state)
      return update(state,{
        skills:{
          $push:action.skill_details
        }
      })
    case constants.USER_ADD_SKILLS_ERR:
      console.log('there was an error: ',action.err)
      return state
  }
  return state;
}

export default User

import { db, queries } from '../config.js'
import winston from 'winston';
import user_profile_cleaner from '../utils/user_profile_cleaner.js'

export const user_profile  = function(data){

  return db.one(queries.UserProfile,data.username)
    .then(function(data){
      return user_profile_cleaner(data)
    })
    .catch(function(err){
      winston.error('Couldnt retrieve user profile : ',err)
      return 'User profile not available'
    })
}

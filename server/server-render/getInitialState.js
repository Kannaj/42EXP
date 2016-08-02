import jwt from 'jsonwebtoken';
import {db,queries} from '../config.js'
import message_list_cleaner from '../utils/message_list_cleaner.js'
import invert_message_list from '../utils/invert_message_list.js'

const getInitialState = (id_token) => {
  let initialState,User,Projects,userNotifications
  return new Promise((resolve,reject) => {
    if(id_token == null){
      initialState = {User:{isAuthenticated: false}}
      resolve(initialState)
    }else{
        var decoded = jwt.verify(JSON.parse(id_token),process.env.JWT_SECRET)
        db.one(queries.UserProfile,decoded.username)
          .then(function(result){
            if(result.skills[0].id === null){
              // basically means that the user hasnt added any skills to his profile. converting to an empty array.
              result.skills = []
            }
            User = {isAuthenticated:true,username:result.username,xp:result.xp,level:result.level,skills:result.skills}
            return db.any(queries.UserProjects,result.username)
                      .then(function(userProjects){
                        // console.log('userProjects: ',userProjects)
                        if(userProjects.length == 0){
                          return {User:User,Projects:[]}
                        }else{

                          let newProjects = invert_message_list(message_list_cleaner(userProjects))

                          // console.log('userProjects is now: ',newProjects)
                          // return {User:User,Projects:userProjects}
                          return {User:User,Projects:newProjects}
                        }
                      })
                      .then(function(userProfileAndProjects){
                        return db.any(queries.UserNotifications,decoded.username)
                                  .then(function(notifications){
                                    if(notifications.length > 0){
                                      notifications.map(function(notification){
                                        notification.server = true;
                                      })
                                    }
                                    return Object.assign({},userProfileAndProjects,{Notifications:notifications})
                                  })
                      })

          })
          .then(function(initialState){
            console.log('final Outcome is : ',initialState)
            resolve(initialState)
          })
          .catch(function(err){
            // console.log('there was an error: ',err.message)
            initialState = {User:{isAuthenticated: false}}
            resolve(initialState)
          })
        }
      })
    }

export default getInitialState;

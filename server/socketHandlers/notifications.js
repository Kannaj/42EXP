import { db, queries } from '../config.js';


export const vote_notification = function(data,status){
  const self = this;
  return db.one(queries.VoteNotification,[data.votee,`You were commended on ${status.skillName.skill}! You gained ${status.xp_value} XP`])
          .then(function(notif){
            self.exchange.publish(data.votee,{type:'notification',details:notif});
            self.exchange.publish(data.votee,{type:'update_stats',stats:status.stats,account_skill_id:data.account_skill_id});
          })
          .catch(function(err){
            throw `There was an error with setting notifications ${err}`
          })
}
// export default notification;

export const set_to_read_notification = function(data,user){
  return db.any(queries.SetToReadNotification,user)
    .then(function(result){
      // res(null,result)
      return result
    })
    .catch(function(err){
      // res('Couldnt update notifs to "read"')
      winston.error('Couldnt update account_notifications : ',err)
      return 'Couldnt update notifs to "read"'
    })
}

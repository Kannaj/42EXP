import {db} from '../config.js';


const notification = function(data,status){
  const self = this;
  return db.one('INSERT into account_notifications (username,message) VALUES($1,$2) returning id,message,unread',[data.votee,`Congrats!You were commended on ${status.skillName}! You gained ${status.xp_value} XP`])
          .then(function(notif){
            self.exchange.publish(data.votee,{type:'notification',details:notif});
            self.exchange.publish(data.votee,{type:'update_stats',stats:status.stats,account_skill_id:data.account_skill_id});
          })
          .catch(function(err){
            throw `There was an error with setting notifications ${err}`
          })
}
export default notification;

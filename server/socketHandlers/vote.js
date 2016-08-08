import {db} from '../config.js';

export const vote = function(data,res){
  const self = this;
  //console.log('voter_level is : ',data.voter_level)
  const xp_value = data.voter_level * 5;
  //console.log('xp_value: ',xp_value)
  db.tx((t) => {
    return t.none('INSERT INTO votes (voter,votee,skill) values ($1,$2,$3)',[
        this.getAuthToken().username,data.votee,data.account_skill_id
      ])
      .then(function(){
        return t.one('UPDATE account SET xp = xp + $1 where username=$2 returning xp,level',[xp_value,data.votee])
      }).then(function(stats){
        // return {vote:'success',stats:stats}
        return db.one('select skill from account_skills where id = $1',[data.account_skill_id])
                  .then(function(skillName){
                    return {vote:'success',stats:stats,skillName}
                  })
      })

  })
  .then(function(status){
    //console.log(status)
    res(null,status.vote)
    // self.exchange.publish(data.votee,{id:1,server:true,message:`you were commended on your skill :seemsgood`})
    /*
      TO-DO - check if the below is valid for all cases. i'm proceeding further with the function even after executing the callback.
              what is socket disconnects before self.exchange.publish triggers? is the context still valid? will the broker still publish to apt channel?
    */
    return db.one('INSERT into account_notifications (username,message) VALUES($1,$2) returning id,message,unread',[data.votee,`Congrats!You were commended on ${status.skillName.skill}! You gained ${xp_value} XP`])
            .then(function(notif){
              self.exchange.publish(data.votee,{type:'notification',details:notif});
              self.exchange.publish(data.votee,{type:'update_stats',stats:status.stats,account_skill_id:data.account_skill_id});
            })
  })
  .catch(function(err){
    //console.log('there was an error: ',err)
    res(err)
  })
}

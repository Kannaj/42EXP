import {db} from '../config.js';

export const vote = function(data,res){
  console.log('recieved data for vote : ',data)
  const xp_value = data.voter_level * 5;
  console.log('xp_value: ',xp_value)
  db.tx((t) => {
    return t.none('INSERT INTO votes (voter,votee,skill) values ($1,$2,$3)',[
        this.getAuthToken().username,data.votee,data.account_skill_id
      ])
      .then(function(){
        return t.none('UPDATE account SET xp = xp + $1 where username=$2',[xp_value,data.votee])
      }).then(function(){
        return {vote:'success'}
      })
  })
  .then(function(status){
    console.log(status)
    res(null,status)
  })
  .catch(function(err){
    console.log('there was an error: ',err)
    res(err)
  })
}

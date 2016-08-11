import {vote} from '../../../server/socketHandlers/vote.js';
import {skill_user} from '../../../server/socketHandlers/skills.js';
import {expect} from 'chai';
import {db} from '../init_db.js';


describe('Commending a user skill',() => {
  let account_skill_id;

  before(function(done){
    let data = {
      username:'test_user_1',
      value:'Javascript'
    }
    return skill_user(data).then(function(result){
      account_skill_id = result[0].id
      return db.none("update account set xp=0 where username='test_user_1'")
        .then(function(){
          done()
        })
    })
  })

  after(function(done){
    return db.none(`DELETE from votes`)
      .then(function(){
        return db.none('DELETE from account_skills')
          .then(function(){
              done()
          })
      })
      .catch(function(err){
        console.log('error: ',err)
      })
  })

  it('should add commend points to votee',() => {
    let data = {
      account_skill_id,
      voter_level:4,
      votee:'test_user_1',
      skill:'Javascript',
      voter:'test_user_2'
    }
    return vote(data).then(function(result){
      expect(result).to.be.contain.keys('vote','stats','skillName','xp_value')
      expect(result.stats).to.contain.keys('xp','level')
      expect(result.skillName).to.be.equal('Javascript')
      expect(result.xp_value).to.be.equal(20)
    })
  })

  it('should increase commend count of votee',() => {
    return db.one('select commends from account_skills where id=$1',account_skill_id)
            .then(function(commendCount){
              expect(commendCount.commends).to.equal(1)
            })
  })

  it('should increase xp level of votee',() => {
    return db.one("select xp from account where username='test_user_1'")
      .then(function(xp){
        expect(xp.xp).to.equal(20)
      })
  })

  //below cant be done
  // it('should add a notification for the votee ',() => {
  //   return db.one("SELECT username,message from account_notifications where username='test_user_1'")
  //     .then(function(stats){
  //       expect(stats.message).to.be.true;
  //     })
  // })
})

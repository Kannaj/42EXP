import { skill_suggestions, skill_user} from '../../../server/socketHandlers/skills.js';
import { expect } from 'chai';
import { db } from '../init_db.js';

describe('skill_user',() => {

  let data;

  after(function(done){
    return db.none("delete from account_skills where username='test_user_1'")
      .then(function(){
        done()
      })
      .catch(function(){
        done()
      })
  })

  it('should add skills for a user',function(){
    data = {
      username:'test_user_1',
      value:'Javascript'
    }
    return skill_user(data).then(function(result){
      // console.log(result)
      expect(result).to.be.an('array');
      expect(result[0]).to.have.all.keys('id','username','skill','commends')
    })
  })

  it('should return an error',function(){
    data = {
      username:'test_user_1',
      value:'Javascript'
    }
    return skill_user(data).catch(function(result){
      expect(result).to.be.equal('Could not insert skill - try again!')
    })
  })

})

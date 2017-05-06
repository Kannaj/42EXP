import { join_project } from '../../../server/socketHandlers/project.js';
import { expect } from 'chai';
import { db } from '../init_db.js';

describe('Join_project handler',() => {
  after(function(done){
    db.none("delete from account_projects where username='test_user_2'")
      .then(function(){
        done()
      })
      .catch(function(err){
        console.log(err)
        done()
      })
  })

  it('should allow user to join a project',() => {
    let data = {
      id: 1, //refers to the project_id
      username: 'test_user_2',
      project: 'test_project_1'
    }
    return join_project(data).then((result) => {
      console.log('Join Project result : ',result)
      expect(result).to.have.all.keys(['result','roomMessage'])
      expect(result.result).to.have.all.keys(['id','last_activity','project','role','unread_messages','messages'])
      expect(result.result.messages).to.be.empty;
      expect(result.roomMessage).to.have.any.keys('project','message','username')
    }).catch((err) => {
      console.log('Join project error : ',err)
    })
  })
})


// need to add tests to check unique constraint between username and project

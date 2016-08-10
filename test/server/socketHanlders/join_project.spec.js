import {join_project} from '../../../server/socketHandlers/project.js';
import {expect} from 'chai';
import {db} from '../init_db.js';

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
      id:1, //refers to the project_id
      username:'test_user_2',
      project: 'test_project_1'
    }
    return join_project(data).then((result) => {
      expect(result).to.have.any.key('id');
      expect(result).to.have.any.key('last_activity');
      expect(result).to.have.any.key('project')
      expect(result).to.have.any.key('role')
      expect(result).to.have.any.key('unread_messages')
      expect(result).to.have.any.key('messages')
    })
  })
})


// need to add tests to check unique constraint between username and project

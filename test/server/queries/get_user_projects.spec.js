import {queries} from '../../../server/config.js';
import {expect} from 'chai';
import {db} from '../init_db.js';


describe('initialstate for user projects', () => {
  let data = {
    project:'test_project_1',
    timestamp : new Date().toISOString(),
    message : 'hello there',
    username:'test_user_1'
  }
  before(function(done){
    return db.none('insert into account_projects (username,project,role) values ($1,$2,$3)',[
      'test_user_1','test_project_1','owner'
    ])
    .then(function(){
      return db.none('insert into project_messages (project,message,username,timestamp) values (${project},${message},${username},${timestamp})',data)
                .then(function(){
                  done()
                })
                .catch(function(err){
                  console.log(err)
                })
    })
    .catch(function(err){
      console.log(err)
    })
  })

  after(function(done){
    return db.none('delete from project_messages')
      .then(function(){
        return db.none('delete from account_projects')
          .then(function(){
            done()
          })
      })
  })

  it('should show project details and messages',() => {
    return db.any(queries.UserProjects,'test_user_1')
      .then(function(result){
        expect(result).to.be.an('array')
        expect(result[0]).to.contain.keys('id','project','last_activity','role','messages','unread_messages')
      })
  })


})

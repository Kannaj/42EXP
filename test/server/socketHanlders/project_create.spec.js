import { create_new_project } from '../../../server/socketHandlers/project.js';
import { expect } from 'chai';

import { db } from '../init_db.js';

describe('Project_create',() => {

  after(function(done){
    db.none("delete from project where name='Test_project_2'")
      .then(function(){
        done()
      })
      .catch(function(err){
        console.log(err)
        done()
      })
  })

  it('should create a project given the correct data and user',() => {

    let data = {
      name: 'Test_project_2',
      category: 'Entertainment',
      description: 'Buckethead',
      github_link:'eh',
      owner: 'test_user_1',
      skill:[{ value: "Java" }],
      username: 'test_user_1',
      pinned: false
    }

    return create_new_project(data)
      .then((result) => {
        console.log('create project result: ',result)
        expect(result).to.have.any.key('id');
        expect(result).to.have.any.key('last_activity');
        expect(result.messages).to.be.empty;
        expect(result).to.have.any.key('project');
        expect(result).to.have.any.key('role')
      }).catch((err) => {
        console.log('create project error : ',err)
      })
    });

  it('should save skills to project_skills',() => {
    return db.any("select * from project_skills where project = 'Test_project_2'")
      .then(function(result) {
        console.log('result is : ',result)
        expect(result).to.be.an('array');
        expect(result[0]).to.have.any.key('skill');
        expect(result[0]).to.have.any.key('project');
    })
  })

  it('should throw an error when project name already exists',() => {
    let data = {
      name:'test_project_1',
      category:'Entertainment',
      description:'Buckethead',
      github_link:'eh',
      owner:'test_user_1',
      skill:[],
      username:'test_user_1',
      pinned: false
    }
    return create_new_project(data)
      .catch((result) => {
        expect(result).to.be.a('string')
        expect(result).to.be.equal('Unable to create your project')
      })
    })

})

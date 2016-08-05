import chai from 'chai'
import {expect} from 'chai';
import {project_list} from '../../server/socketHandlers/project.js';
import sinon from 'sinon';

import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised)


describe('project_list',function(){
  let data = {},result;

  before(function(done){
    project_list(data).then(function(results){
      result = results;
      done()
    })
  })

  it('should retrieve a list',function(){
    expect(result).to.be.an('array')
  })

  it('should return an array of objects containing project details',function(){
    expect(result[0]).to.contain.keys('project_name','project_id','project_description','project_category','skills')
  })

})

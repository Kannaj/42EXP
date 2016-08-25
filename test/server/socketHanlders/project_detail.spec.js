import {project_detail} from '../../../server/socketHandlers/project.js';
import {expect} from 'chai';


describe('project_detail query',() => {
  it('should retrieve details of a project',() => {
    // return expect(project_detail({id:1})).to.eventually.be.an('array');
    return project_detail({id:1}).then((result) => {
       expect(result).to.have.any.key('project_id');
       expect(result).to.have.any.key('project_name');
       expect(result).to.have.any.key('github_link');
       expect(result).to.have.any.key('reddit_link');
       expect(result).to.have.any.key('project_description');
       expect(result).to.have.any.key('project_category');
       expect(result).to.have.any.key('project_owner');
       expect(result).to.have.any.key('skills');
    })
  })
  it('should return an error if id is invalid',() => {
    return project_detail({id:'smartassId'}).catch((result) => {
      expect(result).to.be.equal('project not found')
    })
  })
})

import {project_detail} from '../../../server/socketHandlers/project.js';
import {expect} from 'chai';


describe('project_detail query',() => {
  it('should retrieve details of a project',() => {
    // return expect(project_detail({id:1})).to.eventually.be.an('array');
    return project_detail({id:1}).then((result) => {
       expect(result).to.have.any.key('id');
       expect(result).to.have.any.key('name');
       expect(result).to.have.any.key('github_link');
       expect(result).to.have.any.key('reddit_link');
       expect(result).to.have.any.key('description');
       expect(result).to.have.any.key('category');
       expect(result).to.have.any.key('owner');
       expect(result).to.have.any.key('skills');
       expect(result).to.have.any.key('members');
    })
  })
  it('should return an error if id is invalid',() => {
    return project_detail({id:'smartassId'}).catch((result) => {
      expect(result).to.be.equal('project not found')
    })
  })
})

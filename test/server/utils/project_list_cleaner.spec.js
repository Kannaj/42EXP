import project_list_cleaner from '../../../server/utils/project_list_cleaner';
import chai,{expect} from 'chai';


describe('project_list_cleaner',function(){

  it('should return an empty array if passed an array with null values',function(){
    let values = [{skills:[{skill_id:null,name:'kj'}]}]
    let answer = project_list_cleaner(values)
    let expected = [{skills:[]}]
    expect(answer[0].skills).to.be.empty;
  });

  it('should return the same values passed to it if skills are not null',function(){
    let values = [{skills:[{skill_id:9,name:'kannaj'}]}]
    let answer = project_list_cleaner(values)
    let expected = {skill_id:9,name:'kannaj'}
    expect(answer[0].skills).to.be.an('array')
    expect(answer[0].skills).to.contain(expected)
  })

})

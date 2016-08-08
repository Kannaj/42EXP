import message_list_cleaner from '../../../server/utils/message_list_cleaner.js';
import chai,{expect} from 'chai';


describe('message_list_cleaner',function(){
  it('should clean a nulled message_list',function(){
    let oldObj = [{project:'megadeth',messages:[{id:null,message:null}]},{project:'metallica',messages:[{id:null,message:null}]}];
    let newObj = message_list_cleaner(oldObj);
    expect(newObj).to.be.eql([{project:'megadeth',messages:[]},{project:'metallica',messages:[]}])
  })
})

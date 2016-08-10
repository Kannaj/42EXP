import invert_message_list from '../../../server/utils/invert_message_list.js';
import chai,{expect} from 'chai';

describe('invert_message_list',function(){
  it('should invert_a_given_collection',function(){
    let oldObj = [{messages:[{a:1},{b:2}]},{messages:[{a:1},{b:2}]}]
    let newObj = invert_message_list(oldObj)
    expect(newObj).to.be.eql([{messages:[{b:2},{a:1}]},{messages:[{b:2},{a:1}]}])
  })
})

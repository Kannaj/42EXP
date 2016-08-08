import user_profile_cleaner from '../../../server/utils/user_profile_cleaner';
import chai,{expect} from 'chai';

describe('user_profile_cleaner',function(){

  it('should return an empty array if null values are present',function(){
    let userProfile = {skills:[{id:null,value:null}]}

    const newProfile = user_profile_cleaner(userProfile)
    expect(newProfile.skills).to.be.empty;
  })

  it('shouldnt do anything if actual skill values are preset',function(){
    let userProfile = {skills:[{id:12,value:'python'}]}
    const newProfile = user_profile_cleaner(userProfile)
    expect(newProfile).to.equal(userProfile);
  })

})

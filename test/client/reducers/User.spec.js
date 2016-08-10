import User from '../../../shared/reducers/User/UserReducer.js';
import {expect} from 'chai';


//To-Do : figure out how to test initialState

describe('User Reducer',() => {

  let oldState;

  beforeEach(() => {
      oldState = {
        isAuthenticated:true,
        level:1,
        username:"GeezerButler",
        xp:20,
        skills:[
          {skill:"Python",commends:1,id:1}
        ]
      }
    }
  )

  it('should be able to add skills',() => {
    let skill_details = [{skill:"Javascript",commends:0,id:1}]
    let action = {type:'USER_ADD_SKILLS_SUCCESS',skill_details}
    let newState = User(oldState,action)
    expect(newState).to.have.deep.property('skills[1].skill',"Javascript");
    expect(newState).to.have.deep.property('skills[1].commends',0);
    expect(newState).to.have.deep.property('skills[1].id',1);
  })

  it('should update user skill commends level on commend',() => {
    let stats = {account_skill_id:1,stats:{xp:25,level:3}}
    let action = {type:'UPDATE_USER_STATS',stats}
    let newState = User(oldState,action)
    expect(newState).to.have.deep.property('level',3);
    expect(newState).to.have.deep.property('xp',25);
    expect(newState).to.have.deep.property('skills[0].commends',2)
  })
})

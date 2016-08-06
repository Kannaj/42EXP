import Projects from '../../../shared/reducers/projects/projects.js';
import {expect} from 'chai';


describe('Projects reducer',() => {
  let oldState;

  beforeEach(() => {
    oldState = [
      {
        id:1,
        last_activity: new Date().toISOString(),
        messages:[],
        project:'Anesthetize',
        role:'owner',
        unread_messages:0
      }
    ]
  })

  it('should add new project to state on creation',() => {
    let projectDetails = {id:2,last_activity:new Date().toISOString(),messages:[],project:'Fade-to-black',role:'owner',unread_messages:0};
    let action = {type:'CREATE_PROJECT_SUCCESS',projectDetails}
    let newState = Projects(oldState,action)
    expect(newState[1]).to.have.deep.property('id',2);
    expect(newState[1]).to.have.deep.property('role','owner');
    expect(newState[1]).to.have.deep.property('project','Fade-to-black')
  })

  it('should add new project to state on join',() => {
    let projectDetails = {id:2,last_activity:new Date().toISOString(),messages:[],project:'Fade-to-black',role:'member',unread_messages:0};
    let action = {type:'JOIN_PROJECT_SUCCESS',projectDetails}
    let newState = Projects(oldState,action)
    expect(newState[1]).to.have.deep.property('id',2);
    expect(newState[1]).to.have.deep.property('role','member');
    expect(newState[1]).to.have.deep.property('project','Fade-to-black')
  })

  it('should add a message to the project',() => {
    let messageDetails = {project_id:1,timestamp:new Date().toISOString(),message:'Prying open my third eye',username:'Maynard'}
    let action = {type:'NEW_CHAT_MESSAGE',messageDetails}
    let newState = Projects(oldState,action)
    expect(newState).to.have.length(1)
    expect(newState[0]).to.have.deep.property('unread_messages',1)
    expect(newState[0]).to.have.deep.property('messages[0]',messageDetails)
  })

  it('should update last_activity on project',() => {
    let newTimestamp = new Date().toISOString()
    let data = {id:1,timestamp:newTimestamp}
    let action = {type:'SET_LAST_ACTIVITY',data}
    let newState = Projects(oldState,action)
    expect(newState[0]).to.have.deep.property('last_activity',newTimestamp)
  })

  it('should set unread to 0',() => {
    oldState.unread_messages = 5;
    let action = {type:'SET_UNREAD',id:1}
    let newState = Projects(oldState,action)
    expect(newState[0].unread_messages).to.equal(0)
  })

  it('should edit project',() => {
    let projectDetails = {id:1,project:'Gojira'}
    let action = {type:'EDIT_PROJECT_SUCCESS',projectDetails}
  })

})

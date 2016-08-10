import Notifications from '../../../shared/reducers/notifications/notifications.js';
import {expect} from 'chai';
import uuid from 'node-uuid';


describe('Notifications reducer',() => {

  it('should add an unread notification',() => {
    let messageDetails = {id:uuid.v4(),heading:'error',message:'First notification',unread:true,server:false}
    let action = {type:'ADD_NOTIFICATION',messageDetails}
    let newState = Notifications([],action);
    expect(newState[0]).to.have.deep.property('heading','error')
  })

  it('should remove read notification',() => {
    // let id = uuid.v4()
    let oldState = [{id:1,heading:'error',message:'First notification',unread:true,server:false}]
    let server = true; // fluff. dont bother
    let action = {type:'CLOSE_NOTIFICATION',messageId:1,server}
    let newState = Notifications(oldState,action)
    expect(newState[0]).to.have.deep.property('unread',false)

  })

})

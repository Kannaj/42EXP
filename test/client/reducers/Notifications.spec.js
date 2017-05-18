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
  
})

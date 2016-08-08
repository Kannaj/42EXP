import {App} from '../../../shared/containers/App.jsx'
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

describe('<App/>',() => {
  let Projects = [
    {
      id:1,
      project:'Metallica'
    }
  ]
  it('should show login/register button if user is anonymous',() => {
    const wrapper = shallow(<App location="/" isAuthenticated={false} Projects={Projects}/>)
    expect(wrapper.find('.sidebar_link')).to.have.length(3);
  })

  it('should show notifications is there are any unread messages',() => {
    const wrapper = shallow(<App location="/" unread_notifications={[{id:1,message:"Megadeth"}]}/>)
    expect(wrapper.find('#notification_panel')).to.have.length(1);
    // const notification = wrapper.find('.notification_wrapper')s
    // expect(notification.find('.notification_wrapper')).to.have.length(1)
  })
})

// import { App } from '../../../shared/containers/App.jsx';
// import React from 'react';
// import { expect } from 'chai';
// import { shallow } from 'enzyme';
//
// describe('<App/>',() => {
//   let Projects = [
//     {
//       id:1,
//       project:'Metallica'
//     }
//   ]
//   it('should show login/register button if user is anonymous',() => {
//     const wrapper = shallow(<App location="/" isAuthenticated={false} Projects={Projects}/>)
//   })
//
//   it('should show notifications is there are any unread messages',() => {
//     const wrapper = shallow(<App location="/" Flash_messages={[{id: 1, message: "Megadeth"}]} Projects={Projects}/>)
//     expect(wrapper.find('#notification_panel')).to.have.length(1);
//   })
// })

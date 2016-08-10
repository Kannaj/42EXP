import {Home} from '../../../shared/containers/Home.jsx'
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import {Dashboard} from '../../../shared/containers/UserDashboard.jsx'


describe('<Home/>',() => {
  it('should show landing page for anonymous user',() => {
    const wrapper = mount(<Home isAuthenticated={false} />);
    expect(wrapper.find(Dashboard)).to.have.length(0)
    expect(wrapper.find('#landing_page')).to.have.length(1)
  })
})

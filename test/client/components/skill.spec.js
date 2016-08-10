import Skill from '../../../shared/components/skill'
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

describe('<Skill/>',() => {
  it('should show the skill with commends',() => {
    const wrapper = shallow(<Skill skill="Python" commends={4}/>);
    expect(wrapper.find('.skill_commends')).to.have.length(1)
  })
})

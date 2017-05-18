import React from 'react'
import PropTypes from 'prop-types';

export default class Skill extends React.Component{
  render(){
    return(
        <div className="user_skill">
          <div className="skill_name">
            <h3>{this.props.skill}</h3>
          </div>
          <div className="skill_commends">
            <h3>{this.props.commends}</h3>
          </div>
        </div>
      )
    }
  }

Skill.PropTypes = {
  skill: PropTypes.string.isRequired,
  commends: PropTypes.number.isRequired
}

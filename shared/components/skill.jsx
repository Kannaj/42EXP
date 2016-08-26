import React from 'react'

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

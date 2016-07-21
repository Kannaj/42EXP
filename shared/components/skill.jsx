import React from 'react'

export default class Skill extends React.Component{
  render(){
    return(
        <div>
          <h4>{this.props.skill} --- {this.props.commends}</h4>
        </div>
      )
    }
  }

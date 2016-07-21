import React from 'react';
import {connect} from 'react-redux';

class ProjectChat extends React.Component{
  render(){
    return(
      <h1>Chat for = {this.props.params.projectId} </h1>
    )
  }
}

const ProjectChatContainer = connect(ProjectChat)
export default ProjectChatContainer;

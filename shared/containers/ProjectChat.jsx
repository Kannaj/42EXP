import React from 'react';
import {connect} from 'react-redux';

class ProjectChat extends React.Component{
  render(){
    return(
      <div id="project_chat">

        <div className="chat_room">
          <h1>Chat for = {this.props.params.projectId} -sup</h1>

          <ul>
            <li> hello there</li>
          </ul>

          <div id="chat_message_box">
            <input type='text' className="message_box" placeholder="enter message"/>
            <button className="submit_message">Submit</button>
          </div>
        </div>

        <div className="member_list">
          <h4> Members </h4>
          <ul>
            <li>Steven Wilson</li>
            <li> Mikael</li>
          </ul>
        </div>

      </div>
    )
  }
}

const ProjectChatContainer = connect(null,null)(ProjectChat)
export default ProjectChatContainer;

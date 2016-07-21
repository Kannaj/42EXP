import React from 'react';
import {connect} from 'react-redux';
import Message from '../components/message';
import uuid from 'node-uuid';

class ProjectChat extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      message: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event){
    this.setState({message:event.target.value})
  }

  handleSubmit(){
    socket.emit('new_chat_message',{id:this.props.params.projectId,message:this.state.message})
    this.setState({message:''})
  }

  render(){
    const messages = this.props.messages;
    return(
      <div id="project_chat">

        <div className="chat_room">
          <h1>Chat for = {this.props.params.projectId} -sup</h1>

          <ul>
            {messages.map((message) => {
              return(
                <Message key={uuid.v4()} message={message} />
              )
            })}
          </ul>

          <div id="chat_message_box">
            <input type='text' onChange={this.handleChange} value={this.state.message} className="message_box" placeholder="enter message"/>
            <button className="submit_message" onClick={this.handleSubmit}>Submit</button>
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

const mapStateToProps = (state,ownProps) => {
  const project = state.Projects.filter((proj) => {
    return parseInt(ownProps.params.projectId) == proj.id
  })
  const messages = project[0].messages;
  const unread = project[0].unread_messages;
  return {
    messages,
    unread,
    project
  }
}

const ProjectChatContainer = connect(mapStateToProps)(ProjectChat)
export default ProjectChatContainer;

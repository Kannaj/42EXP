import React from 'react';
import {connect} from 'react-redux';
import Message from '../components/message';
import uuid from 'node-uuid';
import {bindActionCreators} from 'redux';
import {set_last_activity} from '../actions/projects/set_last_activity';
import {set_unread} from '../actions/projects/set_unread.js';
import Waypoint from 'react-waypoint';
import get_more_messages from '../actions/projects/get_more_messages';

class ProjectChat extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      message: '',
      waypointReady: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLastActivity = this.setLastActivity.bind(this)
    this.activateWayPoint = this.activateWayPoint.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount(){
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    this.setState({waypointReady:true})
  }

  setLastActivity(projectId){

    socket.emit('update_last_activity',{id:projectId},function(err,data){
      if(data){
        this.props.set_last_activity({id:projectId,timestamp:data.last_activity})
      }else{
        throw(err)
      }
    }.bind(this))
  }

  // setUnread(){
  //   console.log('setting unread for ; ',this.props.params.projectId)
  //   this.props.set_unread(this.props.params.projectId)
  // }

  componentWillReceiveProps(nextProps){
    if(this.props.messages[0] !== nextProps.messages[0]){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
      // the above sets the scrollbar to prevVersions earliest message.could make it better.
    }

  }

  componentDidUpdate(prevProps,prevState){

    if(this.props.messages[this.props.messages.length - 1] !== prevProps.messages[prevProps.messages.length - 1] && this.props.params.projectId == prevProps.params.projectId){
      // new message recieved. i.e = last message or prev props not the same as last message of new props and same page.
      this.props.set_unread(this.props.params.projectId)
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
    }
    // User has switched to a different chat Room.
    if(this.props.params.projectId !== prevProps.params.projectId){
      this.setLastActivity(prevProps.params.projectId);
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
      this.setState({message:''})
    }
  }



  componentWillUnmount(){
    this.setLastActivity(this.props.params.projectId)
  }

  handleChange(event){
    this.setState({message:event.target.value})
  }

  handleKeyPress(event){
    if(event.key == 'Enter' && !event.shiftKey){
      // console.log('Entered')
      this.handleSubmit();
    }
  }

  handleSubmit(){
    socket.emit('new_chat_message',{id:this.props.params.projectId,message:this.state.message})
    this.setState({message:''})
  }

  activateWayPoint(){
    if(this.state.waypointReady){
      this.props.get_more_messages(this.props.params.projectId,this.props.messages[0].id)
    }else{
      return null
    }
  }

  render(){
    const messages = this.props.messages;
    return(
      <div id="project_chat">


          {
            !this.props.project.length > 0 ?
            <h1> You need to be a member of this project to be part of the chat room </h1>
            :
            <div className="chat_room">
              <div className="messages" ref="messages">
                <Waypoint onEnter={this.activateWayPoint}/>
                <ul>
                  {messages.map((message) => {
                    return(
                      <Message key={uuid.v4()} message={message}/>
                    )
                  })}
                </ul>
              </div>

              <div className="chat_message_box">
                <textarea rows="1" cols="20" type='text' onKeyPress={this.handleKeyPress} onChange={this.handleChange} value={this.state.message} className="message_box" placeholder="enter message"/>
                <button className="submit_message" onClick={this.handleSubmit}>Submit</button>
              </div>
            </div>
          }


      </div>
    )
  }
}

const mapStateToProps = (state,ownProps) => {
  let messages,unread
  const project = state.Projects.filter((proj) => {
    return parseInt(ownProps.params.projectId) == proj.id
  })
  if(project.length > 0){
    messages = project[0].messages;
    unread = project[0].unread_messages;
  }
  return {
    messages,
    unread,
    project
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    set_last_activity,
    set_unread,
    get_more_messages
  },dispatch)
}

const ProjectChatContainer = connect(mapStateToProps,mapDispatchToProps)(ProjectChat)
export default ProjectChatContainer;

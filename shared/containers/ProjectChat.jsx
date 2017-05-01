import React from 'react';
import { connect } from 'react-redux';
import Message from '../components/message';
import uuid from 'node-uuid';
import { bindActionCreators } from 'redux';
import { set_last_activity } from '../actions/projects/set_last_activity';
import { set_unread } from '../actions/projects/set_unread.js';
import Waypoint from 'react-waypoint';
import get_more_messages from '../actions/projects/get_more_messages';
import get_messages from '../actions/projects/get_messages';
import loader from '../components/Loader';

class ProjectChat extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      message: '',
      waypointReady: false,
      retrieveLatestMessages: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLastActivity = this.setLastActivity.bind(this)
    this.activateWayPoint = this.activateWayPoint.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount(){
    // mounting project chat room for the first time?
    if(socket && this.props.project[0].canRetrieveMore == undefined){
      this.props.get_messages(this.props.params.projectId)
      this.setState({ retrieveLatestMessages: false })
    }
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

  componentWillReceiveProps(nextProps){
    if(this.props.messages[0] !== nextProps.messages[0]){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
      // the above sets the scrollbar to prevVersions earliest message.could make it better.
    }

    // switching to a new Project Chat room for the first time in the session?
    // bring up the loader component and then remove once latest messages are recieved
    if ((nextProps.project[0].id !== this.props.project[0].id) &&
        (nextProps.project[0].canRetrieveMore == undefined))
        {
          this.setState({ retrieveLatestMessages: true })
          nextProps.get_messages(nextProps.params.projectId)
          this.setState({ retrieveLatestMessages: false })
          this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
        }

  }

  componentDidUpdate(prevProps,prevState){
    const oldMessageList = prevProps.messages,
          newMessageList = this.props.messages,
          oldProjectId = prevProps.params.projectId,
          newProjectId = this.props.params.projectId,

          isSameRoom = oldProjectId === newProjectId,
          isNewMessage = newMessageList[newMessageList.length - 1] !== oldMessageList[oldMessageList.length - 1] && isSameRoom

    if (oldMessageList.length == 0 && newMessageList.length > 0 && isSameRoom){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
      this.setState({ waypointReady : true})
    }

    if(isNewMessage){
      // new message recieved. i.e = last message or prev props not the same as last message of new props and same page.
      this.props.set_unread(this.props.params.projectId)
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }
    // User has switched to a different chat Room.
    if(newProjectId !== oldProjectId){
      this.setLastActivity(oldProjectId);
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
      this.setState({message:'', waypointReady: false})
    }
  }



  componentWillUnmount(){
    this.setLastActivity(this.props.params.projectId)
  }

  handleChange(event){
    this.setState({ message: event.target.value })
  }

  handleKeyPress(event){
    if(event.key == 'Enter' && this.state.message.trim() == '' && !event.shiftKey){
      event.preventDefault()
    }
    else if(event.key == 'Enter' && !event.shiftKey && this.state.message.trim() !== ""){
      event.preventDefault()
      this.handleSubmit();
    }else if (event.key=='Enter' && event.shiftKey){
      this.refs.message_box.rows++
    }
  }

  handleKeyDown(event){
    if(event.keyCode == 8 && this.state.message.trim() == ""){
      this.refs.message_box.rows--
    }
  }

  handleSubmit(){
    socket.emit('new_chat_message',{ id: this.props.params.projectId, message: this.state.message})
    this.setState({ message: '' })
    this.refs.message_box.rows = 1
  }

  activateWayPoint(){
    if(this.state.waypointReady && this.props.project[0].canRetrieveMore){
      this.props.get_more_messages(this.props.params.projectId,this.props.messages[0].id)
    }else{
      return null
    }
  }

  render(){
    const {messages, project} = this.props;

    if (this.state.retrieveLatestMessages){
      return (
        <div id="project_chat">
          {loader()}
          <div ref="messages">

          </div>
        </div>
      )
    }

    return(
      <div id="project_chat">
          { /* project.length is used to see if the user actually is a member of the project*/
            !project.length > 0 ?
            <h1> You need to be a member of this project to be part of the chat room </h1>
            :
            messages ?
            <div className="chat_room">
              <div className="messages" ref="messages">
              {
                project[0].canRetrieveMore ?
                <div className="chat_room__fetch_more">
                  <Waypoint onEnter={this.activateWayPoint}/>
                  {loader()}
                </div>
                :
                null
              }
                <ul>
                  {messages.map((message) => {
                    return(
                      <Message key={uuid.v4()} message={message}/>
                    )
                  })}
                </ul>
              </div>

              <div className="chat_message_box">
                <textarea rows="1" cols="20" type='text' ref="message_box" onKeyPress={this.handleKeyPress} onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.message} className="message_box" placeholder="enter message"/>
                <button className="submit_message" onClick={this.handleSubmit}>Submit</button>
              </div>
            </div>
            :
            null
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
    get_more_messages,
    get_messages
  },dispatch)
}

const ProjectChatContainer = connect(mapStateToProps,mapDispatchToProps)(ProjectChat)
export default ProjectChatContainer;

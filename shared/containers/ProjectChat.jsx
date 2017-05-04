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
    let project = this.props.project[0]
    if(socket && project.canRetrieveMore == undefined){
      this.props.get_messages(this.props.params.projectId)
    }

    // remounting previously mounted room?
    if (typeof project.canRetrieveMore === 'boolean'){
      this.setState({ retrieveLatestMessages: false })
    }

  }

  setLastActivity(projectId){

    socket.emit('update_last_activity',{id: projectId},function(err,data){
      if(data){
        this.props.set_last_activity({ id:projectId, timestamp:data.last_activity })
      }else{
        throw(err)
      }
    }.bind(this))
  }

  componentWillReceiveProps(nextProps) {

    const oldProjectProps = this.props.project[0],
          newProjectProps = nextProps.project[0],
          oldMessageList = oldProjectProps.messages,
          newMessageList = newProjectProps.messages

    const isSameRoom = oldProjectProps.id === newProjectProps.id ;
    const isNewMessage = newMessageList[newMessageList.length - 1] !== oldMessageList[oldMessageList.length - 1] && isSameRoom && !(typeof this.props.project[0].canRetrieveMore === 'undefined')
    const fetchedLatestMessages = typeof oldProjectProps.canRetrieveMore === 'undefined' && typeof newProjectProps.canRetrieveMore === 'boolean' && isSameRoom

    // once you've recieved the latest messages. switch of the retrieveLatestMessages state to hide the loader.
    if (fetchedLatestMessages){
      this.setState({ retrieveLatestMessages: false})
    }

    if (isNewMessage) {
      // new message recieved?  i.e = last message or prev props not the same as last message of new props
      this.props.set_unread(this.props.params.projectId)
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }


    // switching to a new room for which latest messages havent been retrieved yet?
    if (!isSameRoom && typeof newProjectProps.canRetrieveMore === 'undefined') {
      this.setState({ retrieveLatestMessages: true, waypointReady: false})
      nextProps.get_messages(nextProps.params.projectId)
    }

    // switching to a new room? update last_activity time for previous room
    if (!isSameRoom) {
      this.setLastActivity(oldProjectProps.id)
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
      this.setState({ message: '', waypointReady: false })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const oldProject = prevProps.project[0]
    const newProject = this.props.project[0]
    const isSameRoom = oldProject.id === newProject.id

    // whats going on here? this triggers when we're retrieving past messages for the room
    // if the total number of messages = 20. it would be preferable to scroll to the first message shown before triggering the fetch.
    // i.e - total messages after retrival of old messages = 20. scroll to the 10th message.
    // minor adjustments done for the first few retrievals.
    if (isSameRoom && oldProject.messages[0] !== newProject.messages[0] && oldProject.messages.length !== 0){
      const messageList = document.getElementsByClassName('new_message')
      let earliestMessage = (Math.floor(messageList.length/10) - 1) * 10
      if (earliestMessage == 0){
        if(messageList.length > 10){
          earliestMessage = 10
        }else{
          earliestMessage = 1
        }
      }
      messageList[messageList.length - earliestMessage].scrollIntoView()
    }

    if(!prevState.waypointReady && this.state.waypointReady){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }

    // triggered on first fetch of messages for project.
    if ( prevState.retrieveLatestMessages !== this.state.retrieveLatestMessages){
      if (!prevState.waypointReady){
        this.setState({ waypointReady: true })
      }
    }

    // triggered on page change.
    if (oldProject.id !== newProject.id){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
      this.setState({ waypointReady: true })
    }

    // triggered on new chat message recieved in room
    if(oldProject.messages[oldProject.messages.length - 1] !== newProject.messages[newProject.messages.length -1]){
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }
  }

  componentWillUnmount(){
    console.log('unmounted')
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
    if (this.state.waypointReady && this.props.project[0].canRetrieveMore) {
      this.props.get_more_messages(this.props.params.projectId,this.props.messages[0].id)
    } else {
      return null
    }
  }

  render(){
    const { messages, project } = this.props;
    const { waypointReady } = this.state;

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
                project[0].canRetrieveMore && waypointReady ?
                <div className="chat_room__fetch_more">
                  <Waypoint onEnter={this.activateWayPoint}/>
                  {loader()}
                </div>
                :
                null
              }

                <ul>
                  {
                    messages.map((message) => {
                    return(
                      <Message key={uuid.v4()} message={message}/>
                    )
                  })
                  }
                </ul>

              </div>

              <div className="chat_message_box">
                <textarea rows="1" cols="20" type='text' ref="message_box" onKeyPress={this.handleKeyPress} onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.message} className="message_box" placeholder="enter message"/>
                <button className="submit_message ion-arrow-up-c" onClick={this.handleSubmit}></button>
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

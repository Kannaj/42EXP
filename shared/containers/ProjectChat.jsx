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
    // this.setUnread = this.setUnread.bind(this)
    this.activateWayPoint = this.activateWayPoint.bind(this)
  }

  // probably dont need the below as react-router-redux takes care of setting the unread_messages of initial chat_room to 0
  componentDidMount(){
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    this.setState({waypointReady:true})
  }

  setLastActivity(projectId){
    socket.emit('update_last_activity',{id:projectId},function(err,data){
      if(data){
        console.log(`timestamp recieved for ${projectId} `,data)
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
    // console.log('component will Recieve props')
    if (this.props.params.projectId !== nextProps.params.projectId){
      this.setLastActivity(this.props.params.projectId);
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight
    }
    //  wrote this long ago. no idea why it works :/
    // when the user sends a message in the chat room. unread messages gets updated to 1.
    // the below fires set_unread action to keep it at 0. the same action is fire on componentDidMount

    if(nextProps.project[0].messages.length !== this.props.messages.length){
      this.props.set_unread(nextProps.project[0].id)
    }
    // this.refs.messages.scrollTop = this.refs.messages.scrollHeight
  }



  componentWillUnmount(){
    this.setLastActivity(this.props.params.projectId)
  }

  handleChange(event){
    this.setState({message:event.target.value})
  }

  handleSubmit(){
    socket.emit('new_chat_message',{id:this.props.params.projectId,message:this.state.message})
    this.setState({message:''})
  }

  activateWayPoint(){
    if(this.state.waypointReady){
      console.log('waypoint activated')
      this.props.get_more_messages(this.props.params.projectId,this.props.messages[0].id)
    }else{
      return null
    }
  }

  render(){
    const messages = this.props.messages;
    // console.log('messages : ',messages)
    return(
      <div id="project_chat">
        <h4 className="chat_room_title">{this.props.project[0].project} - Chat Room</h4>
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
            <textarea rows="1" cols="20" type='text' onChange={this.handleChange} value={this.state.message} className="message_box" placeholder="enter message"/>
            <button className="submit_message" onClick={this.handleSubmit}>Submit</button>
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = (state,ownProps) => {
  const project = state.Projects.filter((proj) => {
    return parseInt(ownProps.params.projectId) == proj.id
  })
  // console.log('project[0].messages: ',project[0].messages)
  const messages = project[0].messages;
  // console.log('original: ',project[0].messages.reverse());
  // console.log('NotReversed: ',project[0].messages)
  // console.log('messages : ',messages)
  const unread = project[0].unread_messages;
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

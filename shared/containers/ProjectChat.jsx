import React from 'react';
import {connect} from 'react-redux';
import Message from '../components/message';
import uuid from 'node-uuid';
import {bindActionCreators} from 'redux';
import {set_last_activity} from '../actions/projects/set_last_activity';
import {set_unread} from '../actions/projects/set_unread.js';

class ProjectChat extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      message: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLastActivity = this.setLastActivity.bind(this)
    // this.setUnread = this.setUnread.bind(this)
  }

  // probably dont need the below as react-router-redux takes care of setting the unread_messages of initial chat_room to 0
  // componentDidMount(){
  //   this.setUnread()
  // }

  setLastActivity(projectId){
    // console.log('updating last activity for :',projectId);
    // console.log('this is : ',this.props)
    // let project_id =  this.props.params.projectId
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
      this.setLastActivity(this.props.params.projectId)
    }
    //  wrote this long ago. no idea why it works :/
    // when the user sends a message in the chat room. unread messages gets updated to 1.
    // the below fires set_unread action to keep it at 0. the same action is fire on componentDidMount

    if(nextProps.project[0].messages.length !== this.props.messages.length){
      console.log('updating unread messages for : ',nextProps.project[0].project_id)
      this.props.set_unread(nextProps.project[0].id)
    }
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

  render(){
    const messages = this.props.messages;
    return(
      <div id="project_chat">

        <div className="chat_room">
          <h1>{this.props.project[0].project}</h1>

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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    set_last_activity,
    set_unread
  },dispatch)
}

const ProjectChatContainer = connect(mapStateToProps,mapDispatchToProps)(ProjectChat)
export default ProjectChatContainer;

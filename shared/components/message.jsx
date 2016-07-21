import React,{Component} from 'react';

class Message extends Component{

  render(){
    return(
      <li className="user_message">{this.props.message.username} :{new Date(this.props.message.timestamp).toString() || null}-{this.props.message.message}</li>
    )
  }
}

export default Message;

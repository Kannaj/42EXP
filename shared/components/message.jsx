import React,{Component} from 'react';
import {Link} from 'react-router';

class Message extends Component{

  render(){
    return(
      <li className="user_message">
        <Link to ={`/user/${this.props.message.username}`}> {this.props.message.username} - </Link>
        {new Date(this.props.message.timestamp).toString() || null}-{this.props.message.message}

      </li>
    )
  }
}

export default Message;

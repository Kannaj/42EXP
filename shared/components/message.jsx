import React,{Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment'

class Message extends Component{

  render(){
    return(
      <li id="user_message">
        <Link to ={`/user/${this.props.message.username}`} className="username">
          {this.props.message.username}
        </Link>

        <div className="timestamp">
          {moment().calendar(this.props.message.timestamp)|| null}
        </div>

        <div className="message">
          {this.props.message.message}
        </div>
      </li>
    )
  }
}

export default Message;

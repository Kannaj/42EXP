import React,{Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import Remarkable from 'remarkable';
import hljs from 'highlight.js';

const md = new Remarkable({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  },
  langPrefix: 'hljs language-'
});

class Message extends Component{

  render(){

    if(this.props.message.message_type == 'general'){
      return (
        <li className="new_message general">
          <div className="new_message__general_message">
            <span dangerouslySetInnerHTML={{__html: md.render(this.props.message.message)}}/>
          </div>
        </li>
      )
    }

    return(
      <li className="new_message">

        <div className="new_message__avatar">
          <Link to ={`/user/${this.props.message.username}`}>
            <div className="user_avatar">
              <img src={`https://avatars1.githubusercontent.com/${this.props.message.username}`}/>
            </div>
          </Link>
        </div>

        <div className="new_message__message_details">
          <Link to ={`/user/${this.props.message.username}`} className="username">
            {this.props.message.username}
          </Link>

          <div className="new_message__timestamp">
            {moment(this.props.message.timestamp).calendar()|| null}
          </div>

          <div className="new_message__message">
            <span dangerouslySetInnerHTML={{__html: md.render(this.props.message.message)}}/>
          </div>
        </div>
      </li>
    )
  }
}

export default Message;

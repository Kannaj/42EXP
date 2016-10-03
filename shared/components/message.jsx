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
    return(
      <li className="new_message">

        <div className="avatar">
          <Link to ={`/user/${this.props.message.username}`}>
            <div className="user_avatar">
              <img src={`https://avatars1.githubusercontent.com/${this.props.message.username}`}/>
            </div>
          </Link>
        </div>

        <div className="message_details">
          <Link to ={`/user/${this.props.message.username}`} className="username">
            {this.props.message.username}
          </Link>

          <div className="timestamp">
            {moment(this.props.message.timestamp).calendar()|| null}
          </div>

          <div className="message">
            <span dangerouslySetInnerHTML={{__html: md.render(this.props.message.message)}}/>
          </div>
        </div>
      </li>
    )
  }
}

export default Message;

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
  }
});

class Message extends Component{

  render(){
    return(
      <li id="user_message">
        <Link to ={`/user/${this.props.message.username}`} className="username">
          {this.props.message.username}
        </Link>

        <div className="timestamp">
          {moment(this.props.message.timestamp).calendar()|| null}
        </div>

        <div className="message">

          <span dangerouslySetInnerHTML={{__html: md.render(this.props.message.message)}}/>
        </div>
      </li>
    )
  }
}

export default Message;

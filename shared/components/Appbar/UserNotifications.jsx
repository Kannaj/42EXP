import React,{Component} from 'react';
import {Link} from 'react-router';
import ReactDOM from 'react-dom';

class Notificationbar extends Component{
  constructor(props){
    super(props);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount(){
    // check if click happens in profile menu or outside of it
    // http://stackoverflow.com/questions/23821768/how-to-listen-for-click-events-that-are-outside-of-a-component
    // if statement because server cant recognize document
    if(typeof window !== 'undefined'){
      document.addEventListener('click',this.handleOutsideClick,false)
    }

    // toggle all notifications to read
    if(socket && this.props.unread_messages){
      socket.emit('notifications:set_to_read',{},function(err,data){
        if(data){
          this.props.toggleUnread()
        }
      }.bind(this))
    }
  }

  handleOutsideClick(e){
    // if click happens outside of profile-menu, hide profile-menu
    if(!ReactDOM.findDOMNode(this).contains(e.target)){
      this.props.toggleNotificationBar()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  render(){
    return (
      <div tabIndex="1" onClick={this.props.toggleNotificationBar} className={`user_notifications__bar user_notifications__bar--${this.props.isNotificationBarOpen ? "visible" : "hidden"}`}>
        {this.props.Notification.length > 0 ?
          this.props.Notification.map((notification) => {
            return (
              <div className="user_notifications__message" key={notification.id}>
                <p>{notification.message}</p>
              </div>
            )
          })
          :
            <div className="user_notifications__no_notifications">
              <p> No Notifications :( </p>
            </div>
        }
      </div>
    )
  }
}


class UserNotifications extends Component{
  constructor(props){
    super(props);
    this.state = {
      isNotificationBarOpen: false,
      unread_messages: this.props.unread
    }
    this.toggleNotificationBar = this.toggleNotificationBar.bind(this);
    this.toggleUnread = this.toggleUnread.bind(this);
  }

  toggleNotificationBar(){
    this.setState({isNotificationBarOpen: !this.state.isNotificationBarOpen})
  }

  componentWillReceiveProps(nextProps){
    // dirty check if latest notif is not the same as prev renders notif
    if(this.props.Notification.length > 0){
      if(this.props.Notification[0].id !== nextProps.Notification[0].id){
        this.setState({unread_messages: true})
      }
    }
  }

  toggleUnread(){
    this.setState({unread_messages: false})
  }

  render(){
    return(
      <div className="user_notifications">
        <button className= {`user_notifications__icon ${this.state.unread_messages ? "ion-android-notifications" : "ion-android-notifications-none"}`} onClick={this.toggleNotificationBar}/>
        {
          this.state.isNotificationBarOpen ?
          <Notificationbar unread_messages={this.state.unread_messages} toggleUnread={this.toggleUnread} toggleNotificationBar={this.toggleNotificationBar} {...this.props} isNotificationBarOpen={this.state.isNotificationBarOpen}/>
          :
          null
        }
      </div>
    )
  }
}

export default UserNotifications;

import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {remove_notification} from '../actions/notifications/notifications';
import Notification from '../components/notifications';
import Sidebar from '../components/Sidebar';
import Appbar from '../components/Appbar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isSidebarOpen: true,
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }


  toggleSidebar(){
    this.setState({isSidebarOpen: !this.state.isSidebarOpen})
  }

  render(){
    return(
      <div>

      {this.props.isAuthenticated ? <Sidebar {...this.props} isSidebarOpen={this.state.isSidebarOpen}/> : null}
      <Appbar {...this.props} toggleSidebar={this.toggleSidebar} isSidebarOpen={this.props.isAuthenticated ? this.state.isSidebarOpen : false} />

        <div className={`main ${this.props.isAuthenticated ? this.state.isSidebarOpen ? "main--sidebarOpen" : "main--sidebarClosed" : "main--sidebarClosed"}`}>
          {this.props.children}
        </div>


        {this.props.loading ?
          <div id="loading">
            <i className="ion-load-a"></i>
          </div>
          :
          null
        }


        {
          this.props.unread_notifications ?
          <div id="notification_panel">
            <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
              {this.props.unread_notifications.map((notification) => {
                return (
                  <Notification key={notification.id} {...notification} remove={this.props.remove_notification}/>
                )
              })}
            </ReactCSSTransitionGroup>
          </div>
          :
          null
        }

      </div>
    )
  }
}


const mapStateToProps = (state,ownProps) => {
  const location = ownProps.location.pathname;
  const {isAuthenticated} = state.User;
  const {Projects,Notifications,User} = state;
  const {loading} = state.loader;
  // Probably dont need loader to be a separate object in state.
  // const {Notifications} = state;

  const unread_notifications = Notifications.filter((notification) => {
    return notification.unread === true
  });

  return {
    isAuthenticated,
    Projects,
    User,
    unread_notifications,
    loading,
    location
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    remove_notification
  },dispatch)
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App)

export default AppContainer;

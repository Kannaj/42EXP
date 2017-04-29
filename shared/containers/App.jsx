import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {remove_message} from '../actions/flash_messages/flash_messages';
import Flash_message from '../components/Flash_message';
import Sidebar from '../components/Sidebar';
import Appbar from '../components/Appbar/Appbar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import create_project from '../actions/projects/create_project';

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isSidebarOpen: true,
      isMobile: false
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }


  toggleSidebar(){
    this.setState({isSidebarOpen: !this.state.isSidebarOpen})
  }

  componentWillMount(){

  }

  componentDidMount(){
    if (typeof global.window !== 'undefined'){
      if(window.innerHeight > window.innerWidth){
        this.setState({isSidebarOpen : false, isMobile: true})
      }
    }
  }

  render(){
    return(
      <div>

      {this.props.isAuthenticated ? <Sidebar {...this.props} isSidebarOpen={this.state.isSidebarOpen} isMobile={this.state.isMobile} toggleSidebar={this.toggleSidebar}/>  : null}
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


        { /* Probably move away from ReactCSSTransitionGroup */
          this.props.Flash_messages.length > 0 ?
          <div id="flash_message_panel">
            <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
              {this.props.Flash_messages.map((message) => {
                return (
                  <Flash_message key={message.id} {...message} remove={this.props.remove_message}/>
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
  const {Projects,Notifications,User, Flash_messages} = state;
  const {loading} = state.loader;

  let unread = false;
  // if there are unread notifs
  Notifications.map((notification) => {
    if(notification.unread === true){
      unread = true
    }
  })

  return {
    isAuthenticated,
    Projects,
    User,
    Flash_messages,
    Notifications,
    unread,
    loading,
    location
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    remove_message,
    create_project
  },dispatch)
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App)

export default AppContainer;

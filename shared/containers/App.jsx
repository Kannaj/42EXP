import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {remove_notification} from '../actions/notifications/notifications';
import Notification from '../components/notifications';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

//unread function helps show unread_message count for each project the user as signed up for.
const unread = (count) => {
  if (count !== 0){
    return(
      <span className="unread_count">{count}</span>
    )
  }else{
    null
  }
}

//below function helps determine main header. avoid repeating regex
const header = (location) => {
  if(location == '/projects'){
    return (
      <h3 className="page_title">Projects</h3>
    )
  }else if(location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)/messages')){
    let messageHeaderRegex = location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)/messages')
    const name = messageHeaderRegex[2]
    const id = messageHeaderRegex[1]
    return (
      <h3 className="page_title"><Link to={`/projects/${id}/${name}`}>Chat Room - {name} </Link></h3>
    )
  }else if (location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)')){
    const name = location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)')[2]
    return (
      <h3 className="page_title"> Project - {name}</h3>
    )
  }else if (location.match('/user/(\\S+)')){
    const name = location.match('/user/(\\S+)')[1]
    return (
      <h3 className="page_title"> Profile - {name} </h3>
    )
  }else{
    return(
      <h3 className="page_title"> 42exp</h3>
    )
  }
}

const appStyle = (location) => {
  if(location.match('^/$')){
    return true
  }else{
    return false
  }
}

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen:false,
      register: false,
      login: false
    }
    this.closeModal = this.closeModal.bind(this)
    this.authButtons = this.authButtons.bind(this)
  }

  authButtons(){
    if(process.env.NODE_ENV === 'production'){
      return (
        <div className="auth">
          <button className="login_github"><a href= "/auth/github"> Register With Github </a></button>
        </div>
      )
    }else{
      return (
        <div className="auth">
          <button name="register" className="register" onClick={this.openModal.bind(this,"register")}> Register </button>
          <button name="login" className="login" onClick={this.openModal.bind(this,"login")}> Login </button>
        </div>
      )
    }
  }


  openModal(type){
    this.setState({modalIsOpen:true,[type]:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false,register:false,login:false})
  }

  render(){
    const appClass = classNames({
      'appbar':true,
      'app': !this.props.isAuthenticated && appStyle(this.props.location)
    })
    return(
      <div>
        <input type="checkbox" id="slide" name="" value=""/>

        <div className="sidebar">
          <ul className="sidebar_links">
            <Link to="/" className="sidebar_link"> Home </Link>
            <Link to="/projects" className="sidebar_link" activeClassName="active_link"> Projects </Link>
            <div className="line_break">
              <span className="links_header"> Your projects </span>
            </div>
            <div className="subscribed_projects">
              {this.props.Projects ?
                this.props.Projects.map((project) => {
                  return (
                    <Link to = {`/projects/${project.id}/${project.project}/messages`} key={project.id} className="sidebar_link" activeClassName="active_link"><span className="project_name">{project.project}</span>{unread(project.unread_messages)}</Link>
                  )
                })
                :
                null
              }
            </div>
          </ul>
        </div>

        <div className={appClass}>
        <label htmlFor="slide" className="toggle">
          <span></span>
          <span></span>
          <span></span>
        </label>
          {header(this.props.location)}
          {!this.props.isAuthenticated
            ?
            this.authButtons()
            :
            <div className="auth">
              <button className="logout_button"><a href="/logout">Logout</a> </button>
            </div>
          }

        </div>


        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="content-auth" overlayClassName="overlay-auth">
            {!this.state.register ?
                <Auth url={'/auth/login'}/>
              : <Auth url={'/auth/register'}/>
            }
        </Modal>


        <div id="Main">
          {this.props.children}
        </div>


        {this.props.loading ?
          <div id="loading">
            <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
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
  const {Projects,Notifications} = state;
  const {loading} = state.loader;
  // Probably dont need loader to be a separate object in state.
  // const {Notifications} = state;

  const unread_notifications = Notifications.filter((notification) => {
    return notification.unread === true
  });

  return{
    isAuthenticated,
    Projects,
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

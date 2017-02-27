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
    return (
      <span className="unread_count">{count}</span>
    )
  } else {
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
      login: false,
      isSidebarOpen: true,
      isProfileMenuOpen: false
    }
    this.closeModal = this.closeModal.bind(this)
    this.authButtons = this.authButtons.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleProfileMenu = this.toggleProfileMenu.bind(this)
    this.handleProfileBlur = this.handleProfileBlur.bind(this)
  }

  authButtons(){
    if(process.env.NODE_ENV === 'production'){
      return (
        <div className="auth">
          <a href= "/auth/github"><button className="login_github"> Register With Github</button></a>
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

  toggleSidebar(){
    this.setState({isSidebarOpen: !this.state.isSidebarOpen})
  }

  toggleProfileMenu(){
    this.setState({isProfileMenuOpen: !this.state.isProfileMenuOpen})
  }

  openModal(type){
    this.setState({modalIsOpen:true,[type]:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false,register:false,login:false})
  }

  handleProfileBlur(e){
    console.log('lost focus')

    setTimeout(this.setState({isProfileMenuOpen : false}),2000)
  }

  render(){
    return(
      <div>

        <div className={`sidebar ${this.state.isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>

        <div className="sidebar__logo">
          <img src="http://placeskull.com/75/75"/>
        </div>

        <div className="sidebar__text">
          <h1> My Projects </h1>
          <p> Projects that you've joined will be shown here </p>
        </div>

        <div className="subscribed_projects">
        {
          this.props.Projects ?
          this.props.Projects.map((project) => {
            return (
              <Link to = {`/projects/${project.id}/${project.project}/messages`} key={project.id} className="subscribed_projects__item" activeClassName="active_link"><span className="project_name">{project.project}</span>{unread(project.unread_messages)}</Link>
            )
          })
          :
          null
        }
        </div>

        <div className={`navigation--${this.props.Projects.length > 0 ? "bottom" : "top"}`}>
          <button className="navigation__explore_button">
            <i className="ion-search"/>  Explore
          </button>

          <button className="navigation__lobby_button">
            <i className="ion-person-stalker"/> Visit Lobby
          </button>
        </div>

      </div>

        <div className={`appbar ${this.state.isSidebarOpen ? "appbar--sidebarOpen" : "appbar--sidebarClosed"}`}>
        <button className={`appbar__toggle_button ${this.state.isSidebarOpen ? "ion-chevron-left" : "ion-navicon-round"}`} onClick={this.toggleSidebar}></button>
          {header(this.props.location)}
          {!this.props.isAuthenticated
            ?
            this.authButtons()
            :
            <div className="auth">
              <button className="auth__profile_icon ion-android-person" onClick={this.toggleProfileMenu} aria-hidden="true"></button>
              <div tabIndex="1" onMouseLeave={this.handleProfileBlur} className={`profile_menu profile_menu--${this.state.isProfileMenuOpen ? "visible" : "hidden"}`}>
                <a href="/logout"><button className="profile_menu__logout_button">Logout</button></a>
              </div>
            </div>
          }

        </div>


        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="content-auth" overlayClassName="overlay-auth">
            {!this.state.register ?
                <Auth url={'/auth/login'}/>
              : <Auth url={'/auth/register'}/>
            }
        </Modal>


        <div className={`main ${this.state.isSidebarOpen ? "main--sidebarOpen" : "main--sidebarClosed"}`}>
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

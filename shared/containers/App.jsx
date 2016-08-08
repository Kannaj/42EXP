import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {remove_notification} from '../actions/notifications/notifications';
import Notification from '../components/notifications';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

//below function helps determine main header
const header = (location) => {
  if(location == '/projects'){
    return (
      <h1>Projects</h1>
    )
  }else if(location.match('/projects/(\\d+)/((?:[A-Za-z_ -]|%20)+)/messages')){
    const name = location.match('/projects/(\\d+)/((?:[A-Za-z_ -]|%20)+)/messages')[2]
    const id = location.match('/projects/(\\d+)/((?:[A-Za-z_ -]|%20)+)/messages')[1]
    return (
      // <h1>Chat Room - {name} </h1>
      <h1><Link to={`/projects/${id}/${name}`}>{name} </Link></h1>
    )
  }else if (location.match('/projects/(\\d+)/((?:[A-Za-z_ -]|%20)+)')){
    const name = location.match('/projects/(\\d+)/((?:[A-Za-z_ -]|%20)+)')[2]
    return (
      <h1> Project - {name}</h1>
    )
  }else if (location.match('/user/(\\S+)')){
    const name = location.match('/user/(\\S+)')[1]
    return (
      <h1> Profile - {name} </h1>
    )
  }
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen:false,
      register: false,
      login: false
    }
    this.closeModal = this.closeModal.bind(this)
  }

  openModal(type){
    this.setState({modalIsOpen:true,[type]:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false,register:false,login:false})
  }

  render(){
    return(

      <div>
        <div className="sidebar">
          <ul className="sidebar_links">
            <Link to="/" className="sidebar_link"> Home </Link>
            <Link to="/projects" className="sidebar_link" activeClassName="active_link"> Projects </Link>
            {this.props.Projects ?
              this.props.Projects.map((project) => {
                return (
                  <Link to = {`/projects/${project.id}/${project.project}/messages`} key={project.id} className="sidebar_link" activeClassName="active_link"><span className="project_name">{project.project}</span>{unread(project.unread_messages)}</Link>
                )
              })
              :
              null
            }
          </ul>
        </div>

        <div className="appbar">
          {header(this.props.location)}
          {!this.props.isAuthenticated
            ?
            <div className="auth">
              <button name="register" onClick={this.openModal.bind(this,"register")}> Register </button>
              <button name="login" onClick={this.openModal.bind(this,"login")}> Login </button>
            </div>
            :
            <div className="auth">
              <button><a href="/logout" >Logout</a> </button>
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

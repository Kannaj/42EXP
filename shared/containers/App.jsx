import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {remove_notification} from '../actions/notifications/notifications';
import Notification from '../components/notifications';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen:false,
      register: false,
      login: false
    }
    // this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal(type){
    console.log('type: ',type)
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
            <Link to="/projects" className="sidebar_link"> Projects </Link>
            {this.props.Projects ?
              this.props.Projects.map((project) => {
                return (
                  <Link to = {`/projects/${project.id}/messages`} key={project.id} className="sidebar_link">{project.project} -- {project.unread_messages}</Link>
                )
              })
              :
              null
            }
          </ul>
        </div>

        <div className="appbar">
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


const mapStateToProps = (state) => {

  const {isAuthenticated} = state.User;
  const {Projects,Notifications} = state;
  const {loading} = state.loader; // Probably dont need loader to be a separate object in state.
  // const {Notifications} = state;

  const unread_notifications = Notifications.filter((notification) => {
    return notification.unread === true
  });

  return{
    isAuthenticated,
    Projects,
    unread_notifications,
    loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    remove_notification
  },dispatch)
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App)

export default AppContainer;

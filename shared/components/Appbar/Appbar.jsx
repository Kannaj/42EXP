import React,{Component} from 'react';
import {Link} from 'react-router';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import UserProfile from './UserProfile';
import UserNotifications from './UserNotifications';
import MemberList from '../../components/MemberList';
import slugify from '../../utils/slugify';

//below function helps determine main header. avoid repeating regex
const header = (location,openMemberModal) => {
  if(location == '/projects'){
    return (
      <h3 className="page_title">Projects</h3>
    )
  }else if(location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)/messages')){
    let messageHeaderRegex = location.match('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)/messages')
    const name = messageHeaderRegex[2]
    const id = messageHeaderRegex[1]
    return (
      <h3 className="page_title">
        <Link to={`/projects/${id}/${name}`}>{slugify("deslugify",name)} </Link>
        <button className="ion-person-stalker" onClick={() => openMemberModal(name)}></button>
      </h3>
    )
  }else if (location.match('/user/(\\S+)')){
    const name = location.match('/user/(\\S+)')[1]
    return (
      <h3 className="page_title"> Profile - {name} </h3>
    )
  }else{
    return null
  }
}

class Appbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      memberModal: false,
      memberModal_name: ""
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.openMemberModal = this.openMemberModal.bind(this)
    this.closeMemberModal = this.closeMemberModal.bind(this)
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
    this.props.toggleSidebar()
  }

  openMemberModal(project_name){
    this.setState({memberModal : true, memberModal_name : project_name})
  }

  closeMemberModal(){
    this.setState({memberModal: false})
  }

  render(){
    return(
      <div>
        <div className={`appbar ${this.props.isSidebarOpen ? "appbar--sidebarOpen" : "appbar--sidebarClosed"}`}>
          {this.props.isAuthenticated ? <button className={`appbar__toggle_button ${this.props.isSidebarOpen ? "ion-chevron-left" : "ion-navicon-round"}`} onClick={this.toggleSidebar}></button> : null}
            {header(this.props.location,this.openMemberModal)}

            {
              this.props.isAuthenticated
              ?
              <div className="user_nav">
                <UserNotifications Notification={this.props.Notifications} unread={this.props.unread}/>
                <UserProfile {...this.props}/>
              </div>
              :
              <div className="user_nav">
                <UserProfile {...this.props}/>
              </div>
            }
        </div>

        <Modal isOpen={this.state.memberModal} onRequestClose={this.closeMemberModal} className="content-members" overlayClassName="overlay-members">
            <MemberList project_name={this.state.memberModal_name} close={this.closeMemberModal}/>
        </Modal>
      </div>
    )
  }
}

export default Appbar;

import React,{Component} from 'react';
import {Link} from 'react-router';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Auth from './Auth';

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

class Appbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      isProfileMenuOpen : false,
      modalIsOpen:false,
      register: false,
      login: false,
    }
    this.authButtons = this.authButtons.bind(this)
    this.toggleProfileMenu = this.toggleProfileMenu.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
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

  openModal(type){
    this.setState({modalIsOpen:true,[type]:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false,register:false,login:false})
  }


  toggleProfileMenu(){
    this.setState({isProfileMenuOpen: !this.state.isProfileMenuOpen})
  }

  toggleSidebar(){
    this.props.toggleSidebar()
  }

  componentWillMount(){
    // check if click happens in profile menu or outside of it
    // http://stackoverflow.com/questions/23821768/how-to-listen-for-click-events-that-are-outside-of-a-component
    // if statement because server cant recognize document
    if(typeof window !== 'undefined'){
      document.addEventListener('click',this.handleOutsideClick,false)
    }
  }

  handleOutsideClick(e){
    // if click happens outside of profile-menu, hide profile-menu
    if(!ReactDOM.findDOMNode(this).contains(e.target)){
      this.setState({isProfileMenuOpen: false})
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }


  render(){
    return(
      <div>
        <div className={`appbar ${this.props.isSidebarOpen ? "appbar--sidebarOpen" : "appbar--sidebarClosed"}`}>
          {this.props.isAuthenticated ? <button className={`appbar__toggle_button ${this.props.isSidebarOpen ? "ion-chevron-left" : "ion-navicon-round"}`} onClick={this.toggleSidebar}></button> : null}
            {header(this.props.location)}
            {!this.props.isAuthenticated
              ?
              this.authButtons()
              :
              <div className="auth">
                <img className="auth__profile_icon" src={`https://avatars1.githubusercontent.com/${this.props.User.username}` } onClick={this.toggleProfileMenu}/>
                <div tabIndex="1" onClick={this.toggleProfileMenu} ref={(profile_menu) => {this.profile_menu = profile_menu}} className={`profile_menu profile_menu--${this.state.isProfileMenuOpen ? "visible" : "hidden"}`}>
                  <button className="profile_menu__item"><Link to={`/user/${this.props.User.username}`} className="profile_menu__item">Profile</Link></button>
                  <button className="profile_menu__item"><a href="/logout">Logout</a></button>
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
      </div>
    )
  }
}

export default Appbar;

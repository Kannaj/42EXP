import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Auth from '../components/Auth';
import {Link} from 'react-router';

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
    console.log('this.props.Projects',this.props.Projects)
    return(
      <div>
        <div className="sidebar">
          <ul className="sidebar_links">
            <Link to="/projects" className="sidebar_link"> Projects </Link>
            {this.props.Projects ?
              this.props.Projects.map((project) => {
                return (
                  <Link to = {`/projects/${project.id}/messages`} key={project.id} className="sidebar_link">{project.project}</Link>
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
              <button name="register"onClick={this.openModal.bind(this,"register")}> Register </button>
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
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  console.log('state.Projects: ',state.Projects)
  const {isAuthenticated} = state.User;
  const {Projects} = state;
  console.log('Projects: ',Projects)
  return{
    isAuthenticated,
    Projects
  }
}

const AppContainer = connect(mapStateToProps)(App)

export default AppContainer;

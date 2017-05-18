import React,{Component} from 'react';
import {Link} from 'react-router';
import slugify from '../utils/slugify';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import PropTypes from 'prop-types';

//unread function helps show unread_message count for each project the user as signed up for.
// find a better way
const unread = (count) => {
  if (count !== 0){
    return (
      <span className="unread_count">{count}</span>
    )
  } else {
    null
  }
}

// Either show beginner text if user hasnt subbed to a project yet. Or show list of subbed projects.
const sidebarContent = (projects,openModal = null, closeSidebar) => {
  if (projects.length === 0){
    return (
      <div className="sidebar__text">
        <h3> My Projects </h3>
        <p> Projects that you're a part of will be shown here </p>
      </div>
    )
  } else {
    // make this a separate component perhaps?

    return (
      <div className="subscribed_projects">

        {
          projects.map((project) => {
            return (
              <Link
                to = {`/projects/${project.id}/${project.project}/messages`}
                key={project.id}
                className="subscribed_projects__item"
                activeClassName="active_link"
                onClick={() => closeSidebar()}
              >
                <span className="project_name">{slugify("deslugify",project.project)}</span>
                { unread(project.unread_messages) }
              </Link>
            )
          })
        }
      </div>
    )
  }
}


class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
  }

  openModal(){
    this.setState({ modalIsOpen: true })
  }

  closeModal(){
    this.setState({ modalIsOpen: false })
  }

  // if portrait mode - invoke function to close sidebar on every link click
  closeSidebar() {
    this.props.isMobile ? this.props.toggleSidebar() : false;
  }

  render() {
    // remove 42exp from project list
    const projects = this.props.Projects.slice(1);
    return (
      <div>
        <div className = {`sidebar ${this.props.isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>

          <div className = "sidebar__logo">
            <Link to = "/" onClick = {() => this.closeSidebar()}> <img src = "/images/42exp_logo.svg"/></Link>
          </div>

          <h3 className="subscribed_projects__header"> Projects </h3>
          {
            sidebarContent(projects, this.openModal, this.closeSidebar)
          }

          <div className="sidebar__text">
            <a href="#" className="create_project" onClick={this.openModal}><i className="ion-plus-round" />   Start A New Project </a>
            <Link to="/" className="explore_projects" onClick={() => closeSidebar()}><i className="ion-search"/>   Explore </Link>
          </div>

          {
            this.props.isAuthenticated ?
            <div className={`navigation--bottom`}>
              <Link to="/projects/1/42exp/messages" onClick = {() => this.closeSidebar()}><button className="navigation__lobby_button">
                <i className="ion-person-stalker"/> Visit Lobby
              </button></Link>
            </div>
            :
            null
          }

        </div>

        <Modal isOpen={this.state.modalIsOpen}
               onRequestClose={this.closeModal}
               className="new_project__form"
               overlayClassName="new_project" >
            <ProjectForm
              create_project={this.props.create_project}
              close={this.closeModal}
              admin={this.props.User.admin}/>
        </Modal>

      </div>
    )
  }
}

Sidebar.PropTypes = {
  Flash_messages: PropTypes.array,
  Notifications: PropTypes.array,
  Projects: PropTypes.array,
  User: PropTypes.object,
  children: PropTypes.object,
  create_project: PropTypes.func,
  history: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  location: PropTypes.string,
  toggleSidebar: PropTypes.func.isRequired
}

export default Sidebar;

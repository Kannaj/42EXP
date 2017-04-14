import React,{Component} from 'react';
import {Link} from 'react-router';
import slugify from '../utils/slugify';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';

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
const sidebarContent = (projects,openModal = null) => {
  if (projects.length === 0){
    return (
      <div className="sidebar__text">
        <h3> My Projects </h3>
        <p> Projects that you're a part of will be shown here </p>
        <a href="#" className="create_project" onClick={() => openModal()}><i className="ion-plus-round" />   Start A New Project </a>
        <Link to="/" className="explore_projects"><i className="ion-search"/>   Explore </Link>
      </div>
    )
  } else {
    // make this a separate component perhaps?

    return (
      <div className="subscribed_projects">
        <h3 className="subscribed_projects__header"> Projects </h3>
        {
          projects.map((project) => {
            return (
              <Link
                to = {`/projects/${project.id}/${project.project}/messages`}
                key={project.id}
                className="subscribed_projects__item"
                activeClassName="active_link"
              >
                <span className="project_name">{slugify("deslugify",project.project)}</span>
                {unread(project.unread_messages)}
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
  }

  openModal(){
    this.setState({modalIsOpen:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false})
  }

  render(){
    // remove 42exp from project list
    const projects = this.props.Projects.slice(1);

    return(
      <div>
        <div className={`sidebar ${this.props.isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>

          <div className="sidebar__logo">
            <Link to="/"><img src="/images/42exp_logo.svg"/></Link>
          </div>

          {
            sidebarContent(projects,this.openModal)
          }

          {
            this.props.isAuthenticated ?
            <div className={`navigation--bottom`}>
              <Link to="/projects/1/42exp/messages"><button className="navigation__lobby_button">
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
            <ProjectForm create_project={this.props.create_project} close={this.closeModal}/>
        </Modal>
      </div>
    )
  }
}

export default Sidebar;

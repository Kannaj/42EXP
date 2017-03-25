import React,{Component} from 'react';
import {Link} from 'react-router';
import slugify from '../utils/slugify';

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

class Sidebar extends Component {

  render(){
    const projects = this.props.Projects.slice(1)
    console.log('projects : ',projects)
    return(
      <div>
        <div className={`sidebar ${this.props.isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>

          <div className="sidebar__logo">
            <Link to="/"><img src="/images/42exp_logo.svg"/></Link>
          </div>

          <div className="sidebar__text">
            <h2> My Projects </h2>
            <p> Projects that you've joined will be shown here </p>
          </div>

          <div className="subscribed_projects">
          {
            projects.map((project) => {
              return (
                <Link
                to = {`/projects/${project.id}/${project.project}/messages`}
                key={project.id}
                className="subscribed_projects__item"
                activeClassName="active_link"
                >
                <span className="project_name">{slugify("deslugify",project.project)}</span>{unread(project.unread_messages)}
                </Link>
              )
            })
          }
          </div>
          {
            this.props.isAuthenticated ?
            <div className={`navigation--${projects.length > 0 ? "bottom" : "top"}`}>
              <button className="navigation__lobby_button">
                <i className="ion-person-stalker"/> Visit Lobby
              </button>
            </div>
            :
            <div className={`navigation--${projects.length > 0 ? "bottom" : "top"}`}>
              <Link to="/projects">
                <button className="navigation__explore_button">
                  <i className="ion-search"/>  Explore
                </button>
              </Link>
            </div>
          }

        </div>
      </div>
    )
  }
}

export default Sidebar;

import React,{Component} from 'react';
import {Link} from 'react-router';

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
    return(
      <div>
        <div className={`sidebar ${this.props.isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>

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
      </div>
    )
  }
}

export default Sidebar;

import React from 'react';
import Remarkable from 'remarkable';
import slugify from '../utils/slugify';
import {Link} from 'react-router';

const md = new Remarkable({})

class ProjectChip extends React.Component{
  render(){
    return(
      <div className="project_card">
        <div className="project_card__owner">
          <img className="user_avatar__picture" src={`https://avatars1.githubusercontent.com/${this.props.project.project_owner}`}/>
        </div>
        <div className="project_card__details">
          <div className="name">
            <h3>{slugify("deslugify",this.props.project.project_name)}</h3>
          </div>
          <div className="category">
            <h4> {this.props.project.project_category} </h4>
          </div>
          <div className="description">
            <span dangerouslySetInnerHTML={{__html:md.render(this.props.project.project_description)}}/>
            <div className="description__fade_out"></div>
          </div>
          <div className="skill" >
            {
              this.props.project.skills.length > 0 ?
              this.props.project.skills.map((skill) => {
                return (

                    <button className="project_card__skill_chip" key={skill.skill_id}>#{skill.name}</button>

                )
              })
              :
              null
            }
            <div className="bottom_divider">
              <div className="divider"></div>
            </div>
          </div>
        </div>
        <div className="project_card__actions">
          <Link to={`/projects/${this.props.project.project_id}/${this.props.project.project_name}/`} className="view"> View </Link>

        </div>

      </div>
    )
  }
}

export default ProjectChip;

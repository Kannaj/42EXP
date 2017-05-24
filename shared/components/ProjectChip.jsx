import React from 'react';
import Remarkable from 'remarkable';
import slugify from '../utils/slugify';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const md = new Remarkable({})

class ProjectChip extends React.Component {

  render(){
    const { project_id, project_owner, project_pinned, project_name, project_category, project_description, skills} = this.props.project
    return(
      <div className="project_card">

        <div className="project_card__owner">
          <img className="user_avatar__picture"
              src={`https://avatars1.githubusercontent.com/${ project_owner }`}
              />
        </div>

        <div className="project_card__details">

          <div className="name">
            <h3>{slugify("deslugify", project_name)}</h3>
          </div>

          <div className="category">
            <h4> { project_category } </h4>
          </div>

          <div className="description">
            <span dangerouslySetInnerHTML={{ __html:md.render(project_description) }}/>
            <div className="description__fade_out"></div>
          </div>

          <div className="skill" >
            {
              skills.length > 0 ?
              skills.map((skill) => {
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
          <Link
            to={`/projects/${project_id}/${project_name}/`}
            className="view" >
            View
          </Link>
        </div>

      </div>
    )
  }
}

ProjectChip.PropTypes = {
  project: PropTypes.shape({
    project_category: PropTypes.string.isRequired,
    project_description: PropTypes.string.isRequired,
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_owner: PropTypes.string.isRequired,
    skills: PropTypes.array.isRequired
  })
}

export default ProjectChip;

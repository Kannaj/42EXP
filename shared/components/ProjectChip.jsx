import React from 'react';
import Remarkable from 'remarkable';

const md = new Remarkable({})

class ProjectChip extends React.Component{
  render(){
    return(
      <div className="project_card">
        <div className="project_card__name">
          {this.props.project.project_name}
        </div>
        <div className="project_card__category">
          {this.props.project.project_category}
        </div>
        <div className="project_card__description">
          <span dangerouslySetInnerHTML={{__html:md.render(this.props.project.project_description)}}/>
        </div>
        <div className="project_card__skill" >
        {
          this.props.project.skills.length > 0 ?
          this.props.project.skills.map((skill) => {
            return (

                <button className="project_card__skill_chip" key={skill.skill_id}>{skill.name}</button>

            )
          })
          :
          null
        }
        </div>

      </div>
    )
  }
}

export default ProjectChip;

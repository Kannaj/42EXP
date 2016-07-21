import React from 'react';

class ProjectChip extends React.Component{
  render(){
    return(
      <div className="project_chip">
        <div className="project_name">
          {this.props.project.project_name}
        </div>
        <div className="project_category">
          {this.props.project.project_category}
        </div>
        <div className="project_description">
          {this.props.project.project_description}
        </div>
        <div className="project_skills" >
        {
          this.props.project.skills.length > 0 ?
          this.props.project.skills.map((skill) => {
            return (

                <button className="skill_chip" key={skill.skill_id}>{skill.name}</button>

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

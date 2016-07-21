import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import join_project from '../actions/projects/join_project'

class ProjectDetail extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      project_details:{}
    }
  }

  fetchData(id){
    socket.emit('project:detail',{id:id},function(err,data){
      if(err){
        console.log('error: ',err)
      }else{
        this.setState({project_details:data})
      }
    }.bind(this))
  }

  componentDidMount(){
    console.log('mounted')
    if(socket){
      this.fetchData(this.props.params.projectId)
    }
  }

  handleJoinProject(){
    this.props.join_project({id:this.props.params.projectId,project:this.state.project_details.project_name})
  }

  render(){
    console.log('project_detail: ',this.state)
    return(
      <div className="project_detail">
        <h1> Title - {this.state.project_details.project_name} </h1>
        <h2> Category - {this.state.project_details.project_category} </h2>
        <hr/>
        <p> Description - {this.state.project_details.project_description} </p>
        <div className="project_skills" >

        {
          this.state.project_details.skills?
          this.state.project_details.skills.map((skill) => {
            return (

                <button className="skill_chip" key={skill.skill_id}>{skill.name}</button>
            )
          })
          :
          null
        }

        </div>
        <div className="project_detail_actions">
        {
          !this.props.isAuthenticated  ?
          <h4> Login to join project </h4>
          :

            this.props.username == this.state.project_details.project_owner ?
            <button className="edit_project">Edit Project </button> :
            <button className="join_project" onClick={this.handleJoinProject.bind(this)}>Join Project </button>

        }
        </div>
      </div>

    )
  }
}

const mapStateToProps = (state,ownProps) => {
  let username;
  const {isAuthenticated} = state.User
  if(isAuthenticated){
    const{username} = state.User.username
  }
  return {
    isAuthenticated,username
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    join_project
  },dispatch)
}

const ProjectDetailContainer = connect(mapStateToProps,mapDispatchToProps)(ProjectDetail)
export default ProjectDetailContainer;

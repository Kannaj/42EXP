import React from 'react';
import ProjectChip from '../components/ProjectChip';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {start_request,stop_request} from '../actions/loader'

class ProjectList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      project_list:[]
    }
  }

  fetchData(){
    this.props.start_request()
    socket.emit('project:list',{},function(err,data){
      if(err){
        this.props.stop_request()
      }else{
        this.props.stop_request()
        this.setState({project_list:data})
      }
    }.bind(this))
  }

  componentDidMount(){
    if(socket){
      this.fetchData()
    }
  }


  render(){
    return(
      <div id="List">
        <div id="project_list">
        {
          this.state.project_list.length > 0 ?
            this.state.project_list.map((project) => {
              return (
                <Link to = {`/projects/${project.project_id}/${project.project_name}`} key={project.project_id}>
                  <ProjectChip key={project.project_id} project = {project}/>
                </Link>
              )
            })
            :
            <h1> No projects yet! Signup to create one! </h1>
        }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    start_request,
    stop_request
  },dispatch)
}

const ProjectListContainer = connect(null,mapDispatchToProps)(ProjectList)

export default ProjectListContainer;

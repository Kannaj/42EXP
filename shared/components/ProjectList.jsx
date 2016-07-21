import React from 'react';
import ProjectChip from './ProjectChip';
import {Link} from 'react-router';

class ProjectList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      project_list:[]
    }
  }

  fetchData(){

    socket.emit('project:list',{},function(err,data){
      if(err){
        console.log('error: ',err)
      }else{
        this.setState({project_list:data})
      }
    }.bind(this))
  }

  componentDidMount(){
    console.log('mounted')
    if(socket){
      this.fetchData()
    }
  }


  render(){
    console.log('this.state: ',this.state)
    return(
      <div>
        <h1> Projects </h1>
        {
          this.state.project_list.length > 0 ?
            this.state.project_list.map((project) => {
              return (
                <Link to = {`/projects/${project.project_id}`} key={project.project_id}>
                  <ProjectChip key={project.project_id} project = {project}/>
                </Link>
              )
            })
            :
            <h1> No projects yet! Signup to create one! </h1>
        }
      </div>
    )
  }
}

export default ProjectList;

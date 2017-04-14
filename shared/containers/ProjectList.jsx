import React from 'react';
import ProjectChip from '../components/ProjectChip';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {start_request,stop_request} from '../actions/loader'
import Modal from 'react-modal';
import loader from '../components/Loader';

class ProjectList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      project_list:[],
      show_jumbotron: true,
      isFetching: true
    }
    this.dismiss_jumbotron = this.dismiss_jumbotron.bind(this);
  }

  fetchData(){
    socket.emit('project:list',{},function(err,data){
      if(err){
      }else{

        this.setState({project_list:data,isFetching: false})
      }
    }.bind(this))
  }

  dismiss_jumbotron(){
    localStorage.setItem('new_user', false)
    this.setState({show_jumbotron: false})
  }

  componentDidMount(){
    if(socket){
      this.fetchData()
    }

    let showJumbotron = localStorage.getItem('new_user')

    if(showJumbotron == 'undefined' || null){
      localStorage.setItem('new_user',true)
    }

    if (showJumbotron === "false"){
      this.setState({show_jumbotron: false})
    }
  }


  render(){
    if(this.state.isFetching){
      return loader()
    }
    return(
      <div className="project_list">
        {this.state.show_jumbotron ?
          <div className="jumbotron">
            <h2> New here ? </h2>
            <p> Welcome to 42exp. You can find a list of recent projects to join below. </p>
            <p> Be sure to fill up your profile with your up-to-date skillset for other users to look at</p>
            <p> Be sure to also visit the lobby chatroom if you have further questions </p>
            <button className="jumbotron__dismiss" onClick={this.dismiss_jumbotron}> Got it </button>
          </div>
          :
          null
        }
        <h3 className="project_list__header"> Recent Projects </h3>
      {
        this.state.project_list.length > 0 ?
          this.state.project_list.map((project) => {
            return (
                <ProjectChip key={project.project_id} project = {project}/>
            )
          })
          :
          <h1> No projects yet! Signup to create one! </h1>
      }

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    start_request,
    stop_request,
    // create_project
  },dispatch)
}

const ProjectListContainer = connect(null,mapDispatchToProps)(ProjectList)

export default ProjectListContainer;

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import join_project from '../actions/projects/join_project';
import edit_project from '../actions/projects/edit_project';
import ProjectForm from '../components/ProjectForm';
import Modal from 'react-modal';
import { Link } from 'react-router';
import Remarkable from 'remarkable';
import slugify from '../utils/slugify';
import loader from '../components/Loader';
import PropTypes from 'prop-types';

const md = new Remarkable({})

class ProjectDetail extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      project_details:{},
      modalIsOpen:false,
      canJoin: true,
      isFetching: true,
      canEdit: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(){
    this.setState({ modalIsOpen: true })
  }

  closeModal(){
    this.setState({ modalIsOpen: false })
  }

  fetchData(id) {
    socket.emit('project:detail',{ id: id },function(err,data) {
      if(err) {
        console.log('error: ',err)
      } else {
        this.setState({ project_details: data, isFetching: false})
        if(this.props.username === data.owner){
          this.setState({canEdit : true, canJoin: false})
        }
        if(this.props.project.role === 'member'){
          // user has already joined project
          this.setState({ canJoin : false})
        }
      }
    }.bind(this))
  }

  componentDidMount() {
    if(socket) {
      this.fetchData(this.props.params.projectId)
    }
  }

  handleJoinProject() {
    this.props.join_project({ id: this.props.params.projectId, project: this.state.project_details.name })
  }

  render(){

    if(this.state.isFetching) {
      return (
        loader()
      )
    }

    return (
      <div className="project_detail">

        <div className="main_content">
          <h2 className="main_content__project_name">{slugify('deslugify',this.state.project_details.name)}</h2>
          <h3 className="main_content__category">{this.state.project_details.category} </h3>

          <div className="project_skills" >
            {
              this.state.project_details.skills.length > 0 ?
              this.state.project_details.skills.map((skill) => {
                return (
                  <button className="project_skills__skill" key={skill.skill_id}>
                           #{skill.name}
                  </button>
                )
              })
              :
              null
            }
          </div>


          <h4 className="members_header"> Members </h4>
          <div className="member_list">
            {
              this.state.project_details.members.map((member,i) => {
                return (
                    <img className="member_list__members" key={i} src={`https://avatars1.githubusercontent.com/${member.name}` } />
                )
              })
            }
          </div>

            {
              this.state.project_details.github_link ?
              <div className="project_links">
                <h4> External links </h4>
                <a href={this.state.project_details.github_link} className="project_links__item"><button className="ion-social-github"></button> </a>
              </div>
              :
              null
            }

        </div>

        <div className="secondary_content">
          <h4 className="description_header"> Details </h4>
          <div className="description">
            <span dangerouslySetInnerHTML={{__html:md.render(this.state.project_details.description)}}/>
          </div>
          <div className="secondary_content__action_buttons">
            <div className="secondary_content__CTA">
              {
                !this.props.isAuthenticated  ?
                <a href= "/auth/github" className="show_register_message">
                  <button className="main_content__login">
                      Login To Join Project
                  </button>
                </a>
                :
                null
              }
              {this.state.canJoin && <button className="main_content__join_project" onClick={this.handleJoinProject.bind(this)}>Join Project </button>}
              {this.state.canEdit && <button className="main_content__edit_project" onClick={this.openModal}>Edit Project </button>}
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.modalIsOpen}
               onRequestClose={this.closeModal}
               className="new_project__form"
               overlayClassName="new_project" >

            <ProjectForm
              {...this.state.project_details}
              id = {this.props.params.projectId}

            edit_project={this.props.edit_project} close={this.closeModal}/>

        </Modal>

      </div>
    )
  }
}

ProjectDetail.PropTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  join_project: PropTypes.func.isRequired,
  edit_project: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

const mapStateToProps = (state,ownProps) => {
  let username,project
  let projectIndex = state.Projects.findIndex((proj) => {
    return proj.id == ownProps.params.projectId
  })

  project = state.Projects[projectIndex]

  const { isAuthenticated } = state.User

  if (isAuthenticated) {
    username = state.User.username
  }
  return {
    isAuthenticated,
    username,
    project
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    join_project,
    edit_project,
  },dispatch)
}

const ProjectDetailContainer = connect(mapStateToProps,mapDispatchToProps)(ProjectDetail)
export default ProjectDetailContainer;

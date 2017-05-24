import React from 'react';
import ProjectChip from '../components/ProjectChip';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import loader from '../components/Loader';
import Waypoint from 'react-waypoint';

// TO-DO : move ProjectList to Component Folder as we do not need to use redux
class ProjectList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      project_list: [],
      show_jumbotron: true,
      isFetching: true,
      fetchMore: false,
      filterPinned: false
    }
    this.dismiss_jumbotron = this.dismiss_jumbotron.bind(this);
    this.activateWayPoint = this.activateWayPoint.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
  }

  fetchData(filterPinned){
    this.setState({ isFetching: true })
    socket.emit('project:list', filterPinned, function(err,data){
      if(err){
        //
      }else{
        let fetchMore = data.length >= 5 ? true : false
        this.setState({ project_list: data, isFetching: false, fetchMore})
      }
    }.bind(this))
  }

  activateWayPoint(){
    let project_list = this.state.project_list
    let lastId = project_list[project_list.length - 1].project_id
    socket.emit('project:list_more',{ lastId },function(err,data){
      if (err) {
        console.log('there was an error : ',err)
      } else {
        let newList = project_list.concat(data)
        let fetchMore = data.length == 10 ? true : false
        this.setState({ project_list : newList, fetchMore })
      }
    }.bind(this))
  }

  dismiss_jumbotron() {
    localStorage.setItem('new_user', false)
    this.setState({ show_jumbotron: false })
  }

  componentDidMount() {

    let filterPinned = localStorage.getItem('filterPinned')
    if (filterPinned === null) {
      filterPinned = false;
      localStorage.setItem('filterPinned', false)
    }
    if(filterPinned === 'true' || 'false'){
      filterPinned = JSON.parse(filterPinned)
      this.setState({ filterPinned })
    }

    const showJumbotron = localStorage.getItem('new_user')
    if (showJumbotron == 'undefined' || null) {
      localStorage.setItem('new_user',true)
    }
    if (showJumbotron === "false") {
      this.setState({ show_jumbotron: false })
    }


    if(socket) {
      this.fetchData({ filterPinned: filterPinned })
    }

  }

  changeFilters(){
    let filterPinned = !this.state.filterPinned
    this.setState({ filterPinned })
    this.fetchData({ filterPinned })
    localStorage.setItem('filterPinned',filterPinned)
  }


  render(){
    if (this.state.isFetching) {
      return loader()
    }

    return (
      <div className="project_list">
        { this.state.show_jumbotron && this.props.isAuthenticated ?
          <div className="jumbotron">
            <h2> New here ? </h2>
            <p> Welcome to 42exp. You can find a list of recent projects to join below. </p>
            <p> Be sure to fill up your profile with your up-to-date skillset for other users to look at</p>
            <p> Be sure to also visit the lobby chatroom if you have further questions </p>

            <div className="actions">
              <Link className="actions__lobby" to="/projects/1/42exp/messages">Visit Lobby</Link>
              <Link className="actions__profile" to={`/user/${this.props.username}`}> Profile </Link>
              <button className="actions__dismiss" onClick={this.dismiss_jumbotron}> X </button>
            </div>

          </div>
          :
          null
        }
        <h3 className="project_list__header"> Recent Projects </h3>

        <div className="project_list__filters">
          <input type="checkbox" checked={ this.state.filterPinned } onChange={ this.changeFilters } /><span> Hide 42exp related projects </span>
        </div>

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
      {
        this.state.fetchMore ?
        <div className="project_list__fetch_more">
          <Waypoint onEnter={this.activateWayPoint}/>
          { loader() }
        </div>
        :
        null
      }
      </div>

    )
  }
}

// const mapStateToProps = (state) => {
//   const User = state.User
//   return { User }
// }

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    // start_request,
    // stop_request,
    // create_project
  },dispatch)
}

const ProjectListContainer = connect(null,mapDispatchToProps)(ProjectList)

export default ProjectListContainer;

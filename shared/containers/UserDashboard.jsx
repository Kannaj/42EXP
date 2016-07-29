import React from 'react';
import Skill from '../components/skill';
import Select from 'react-select';
import user_add_skills from '../actions/User/actions';
import Modal from 'react-modal';
import ProjectForm from '../components/ProjectForm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import create_project from '../actions/projects/create_project';

// function is responsible for returning autocomplete options to react-select
// the proper function actually resides in autocomplete.js in utils folder.
// To-do : remove selOptions and use the one specified in autocomplete.js

const selOptions = (coll) => {
  let newColl = [];
  coll.map((skill) => {
    let newSkill = {};
    newSkill.value = skill.name;
    newSkill.label = skill.name;
    newColl.push(newSkill)
  })
  return newColl
}

class Dashboard extends React.Component{

  constructor(props){
    super(props);
    this.state ={
      skills: [],
      value:"",
      modalIsOpen:false
    }
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  getOptions(input,callback){
    if(socket && input.length > 3){
      socket.emit('skill:suggestions',{skill:input},(err,data) => {
        if(data){
          let opt = selOptions(data)
          callback(null,{options:opt,complete:true})
        }
      })
    }
  }

  handleChange(input){
    if(socket){
      this.props.user_add_skills(input)
    }
  }

  openModal(){
    this.setState({modalIsOpen:true})
  }

  closeModal(){
    this.setState({modalIsOpen:false})
  }


  render(){
    return(
      <div>
        <h1 className="welcome_message"> Welcome {this.props.username} </h1>

        <div id="user_stats">
          <div className="Level">
            <h2> {this.props.level} </h2>
            <h3 className="stat_header"> Level </h3>
          </div>
          <hr/>
          <div className="Xp">
            <h2> {this.props.xp} </h2>
            <h3 className="stat_header"> Total Xp Earned </h3>
          </div>
        </div>

        <div id="user_skills">

            {
              this.props.skills.length ?

              <div>
                <h3> Your skills </h3>
                {
                  this.props.skills.map((skill) => {
                    return (
                      <Skill key={skill.id} skill={skill.skill} commends={skill.commends} />
                    )
                  })
                }
              </div>
              :
              null
            }
            <div>
                <Select.Async name="account_skills"
                              loadOptions={this.getOptions}
                              onChange={this.handleChange}
                              value={this.state.value}  />

            </div>
        </div>
        <div id="create_project">
          <button onClick={this.openModal}> Start a project </button>
        </div>

        <Modal isOpen={this.state.modalIsOpen}
               onRequestClose={this.closeModal}
               className="content-project"
               overlayClassName="overlay-project" >

            <ProjectForm create_project={this.props.create_project}/>

        </Modal>

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    user_add_skills,
    create_project
  },dispatch)
}


const DashBoardContainer = connect(null,mapDispatchToProps)(Dashboard)
export default DashBoardContainer;

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

export class Dashboard extends React.Component{

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
    this.handleSubmit = this.handleSubmit.bind(this);
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
    this.setState({value:input})
  }

  handleSubmit(){
    if(socket){
      if(this.state.value){
        this.props.user_add_skills(this.state.value)
      }
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
        <h1 className="welcome_message"> Hello {this.props.username}! </h1>
        <p className="summary"> This is where you'll be able add/modify your skillset. Your skillset is what other members would see and be able to commend. </p>
        <p className="summary"> Remember - Your XP and levels are based on the total commends you recieve </p>

        <div className="user_stats">
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

        <div className="user_skills">

            {
              this.props.skills.length ?

              <div>
                <h3 className="main_header"> Your Skillset </h3>
                <div className="headers">
                  <h3 className="skill_header">Skill</h3>
                  <h3 className="commends_header">Commends</h3>

                </div>
                {
                  this.props.skills.map((skill) => {
                    return (
                      <Skill key={skill.id} skill={skill.skill} commends={skill.commends} profile={false} />
                    )
                  })
                }
              </div>
              :
              null
            }
            <div className="user_add_skill">
                <Select.Async name="account_skills"
                              placeholder="Add Skill"
                              minimumInput={2}
                              loadOptions={this.getOptions}
                              onChange={this.handleChange}
                              value={this.state.value}  />
                <button className="submit_skill" onClick={this.handleSubmit}> Add Skill </button>

            </div>
        </div>
        <div id="create_project">
          <button onClick={this.openModal}> Start a new project </button>
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

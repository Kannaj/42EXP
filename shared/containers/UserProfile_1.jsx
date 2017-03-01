import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {start_request,stop_request} from '../actions/loader';
import Select from 'react-select';
import user_add_skills from '../actions/User/actions';
import Skill from '../components/skill';
import _ from 'lodash';
import {skillOptions} from '../utils/Autocomplete';
import update from 'react-addons-update';
import uuid from 'node-uuid';

import {add_notification} from '../actions/notifications/notifications';
import {user_add_skills_success} from '../actions/User/actions';

class UserSkillRow extends React.Component{
  render(){
    return (
      <tr>
        <td className="user_skills__skill_name">{this.props.skill.skill}</td>
        <td className="user_skills__commend_score">{this.props.skill.commends}</td>
        {this.props.canCommend ? <td><button className="user_skills__commend_button ion-thumbsup" onClick={this.props.handleCommend.bind(this,this.props.skill.id,this.props.idx,this.props.skill)}></button></td> : null}
      </tr>
    )
  }
}

class UserSkills extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      skills : {},
      value : ""
    }
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommend = this.handleCommend.bind(this);
  }

  getOptions(input,callback){
    if(socket){
      socket.emit('skill:suggestions',{skill:input},(err,data) => {
        if(data){
          let opt = skillOptions(data)
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
      socket.emit('skills:user',this.state.value,function(err,data){
        if(err){
          this.props.add_notification({id:uuid.v4(),heading:'error',message:'You\"ve already added the skill',unread:true,server:false})
        }else{
          this.props.user_add_skills_success(data)
          this.props.addSkill(data)
        }
      }.bind(this))
    }
  }

  handleCommend(id,idx,skill){
    if(socket){
      socket.emit('user:vote',{account_skill_id:id,voter_level:this.props.User.level,votee:this.props.target_user.username,skill},function(err,data){
        if(err){
          this.props.add_notification({id:uuid.v4(),heading:'Error',message:`Looks like you've already commended ${this.props.target_user.username}!!`,unread:true,server:false})
        }else{
          this.props.add_notification({id:uuid.v4(),heading:'Info',message:`You\'ve successfully commended ${this.props.target_user.username}!!`,unread:true,server:false})
          this.props.addCommend(idx)
        }
      }.bind(this))
    }
  }

  render(){
    return (
      <div className="user_skills">
        <h2 className="user_skills__header">{this.props.target_user.username}'s Skills</h2>
          {
            this.props.canEdit ?
            <div className="user_skills__add">
              <Select.Async name="account_skills"
                            placeholder="Add a new skill"
                            loadOptions= {_.debounce(this.getOptions,1000)}
                            minimumInput={1}
                            onChange={this.handleChange}
                            value={this.state.value}
                            autoload={false}
                            />
              <button className="submit_skill" onClick={this.handleSubmit}> Add Skill </button>
            </div>
            :
            null
          }
          {
            this.props.target_user.skills.length > 0 ?
            <table className={`user_skills__table user_skills__table--${this.props.canEdit ? "" : "no_edit"}`}>
              <thead>
                <tr>
                  <th className="user_skills__head"> Skill </th>
                  <th className="user_skills__head">Commends</th>
                  {this.props.canCommend ? <th className="user_skills__head">Commend</th> : null}
                </tr>
              </thead>

              <tbody>

                {
                  this.props.target_user.skills.map((skill,i) => {
                    return <UserSkillRow skill={skill} handleCommend={this.handleCommend} key={i} canCommend={this.props.canCommend} idx={i}/>
                  })
                }
              </tbody>
            </table>
            :
            null
          }
      </div>
    )
  }
}

class UserProfile_1 extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      user: null
    }
    this.addSkill = this.addSkill.bind(this);
    this.addCommend = this.addCommend.bind(this);
  }

  componentDidMount(){
    let username = this.props.params.username;

    if(socket){
      this.props.start_request()
      socket.emit('user:profile',{username: username},function(err,data){
        if(err){
          this.props.stop_request()
        }else{
          this.props.stop_request()
          this.setState({user:data})
        }
      }.bind(this))
    }
  }

  addSkill(data){
    this.setState({user: update(this.state.user,{
      skills:{
        $push : data
      }
    })})
  }

  addCommend(idx){
    this.setState({user: update(this.state.user,{
      skills:{
        [idx]:{
          commends:{
            $apply:function(i){
              return i + 1;
            }
          }
        }
      }
    })})
  }

  render(){
    let canEdit,canCommend = false;
    // check user privileges
    if (this.state.user){
      if (this.props.User.isAuthenticated){
        canEdit = this.state.user.username === this.props.User.username;
        canCommend = this.state.user.username !== this.props.User.username;
      }
    }

    return (
      <div className="wrapper">
        {
          this.state.user ?
          <div className="user_profile">
            <div className="user_stats">

              <div className="user_avatar">
                <img className="user_avatar__picture" src={`https://avatars1.githubusercontent.com/${this.state.user.username}`}/>
                <h2 className="user_avatar__username">{this.state.user.username}</h2>
              </div>

              <div className="user_score">
                <div className="user_score__level">
                  <h3 className="stat_header"> Level </h3>
                  <h2 className="stat_score"> {this.state.user.level} </h2>
                </div>

                <div className="user_score__xp">
                  <h3 className="stat_header"> Total Xp Earned </h3>
                  <h2 className="stat_score"> {this.state.user.xp} </h2>
                </div>
              </div>

            </div>

            <UserSkills
              canEdit={canEdit}
              canCommend={canCommend}
              target_user={this.state.user}
              {...this.props}
              addSkill={this.addSkill}
              addCommend={this.addCommend}
              />

          </div>
          :
          <p> User not found </p>
        }
      </div>
    )
  }
}


const mapStateToProps = (state,ownProps) => {
  const {User} = state;
  return {
    User
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    start_request,
    stop_request,
    user_add_skills,
    user_add_skills_success,
    add_notification
  },dispatch)
}


export default connect(mapStateToProps,mapDispatchToProps)(UserProfile_1);

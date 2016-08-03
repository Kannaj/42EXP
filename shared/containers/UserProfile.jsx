import React from 'react';
import {connect} from 'react-redux';
import Skill from '../components/skill';
import uuid from 'node-uuid';
import update from 'react-addons-update';
import {bindActionCreators} from 'redux';
import {start_request,stop_request} from '../actions/loader'

class UserProfile extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount(){
    if(socket){
      this.props.start_request()
      socket.emit('user:profile',{username:this.props.params.username},function(err,data){
        if(err){
          // console.log('error: ',err)
          this.props.stop_request()
        }else{
          // console.log('recieved data on user Profile :  ',data)
          this.props.stop_request()
          this.setState({user:data})
        }
      }.bind(this))
    }
  }

  handleClick(id,idx){
    if(socket){
      socket.emit('user:vote',{account_skill_id:id,voter_level:this.props.level,votee:this.state.user.username},function(err,data){
        if(err){
          console.log(err)
        }else{
          this.setState({user:update(this.state.user,{
            skills:{
              [idx]:{
                commends:{
                  $apply:function(i){
                    console.log('i value is : ',i)
                    return i + 1;
                  }
                }
              }
            }
          })})
        }
      }.bind(this))
    }
  }

  render(){
    return(
      <div>
        {
          this.state.user ?
          <div>
            <div className="user_stats">
              <div className="Level">
                <h2> {this.state.user.level} </h2>
                <h3 className="stat_header"> Level </h3>
              </div>
              <hr/>
              <div className="Xp">
                <h2> {this.state.user.xp} </h2>
                <h3 className="stat_header"> Total Xp Earned </h3>
              </div>
            </div>

            {
              this.state.user.skills.length > 0 ?

              <div className="user_skills">


                <h3>{this.state.user.username}'s skillset </h3>
                <div className="headers">
                  <h3 className="skill_header">Skill</h3>
                  <h3 className="commends_header">Commends Recieved</h3>
                  {
                    this.state.user.username == this.props.username ?
                    null : <h3 className="commends_header">Commend</h3>
                  }
                </div>

                {
                  this.state.user.skills.map((skill,idx) => {
                    return (
                      <div key={uuid.v4()} className="profile_skills">
                        {/* profile props sent to Skill Component help determing if user is accessing from dashboard or from userProfile component. Helps remove the
                          "remove" button. temporary. */}
                        <Skill skill={skill.skill} commends={skill.commends} profile={true}/>

                        {/* probably a better way to do the below? checks if the profile belongs to the logged in user or not */}

                        {
                          this.state.user.username == this.props.username ?
                          null : <div className="commend"><button className="commend_button" onClick={this.handleClick.bind(this,skill.id,idx)}>Commend</button></div>
                        }

                      </div>
                    )
                  })
                }
              </div>
                :
                null
            }
          </div>
          :
          <h2> loading .... </h2>
        }

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const {username,level} = state.User;
  return {
    username,level
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    start_request,
    stop_request
  },dispatch)
}

const UserProfileContainer = connect(mapStateToProps,mapDispatchToProps)(UserProfile)

export default UserProfileContainer;

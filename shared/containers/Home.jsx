import React from 'react';
import DashBoardContainer from '../containers/UserDashboard'
import {connect} from 'react-redux';
import user_add_skills from '../actions/User/actions.js'
import {bindActionCreators} from 'redux';

export class Home extends React.Component{
  render(){
    return(
      <div>
        {
          this.props.isAuthenticated ?
            <DashBoardContainer {...this.props} />
            : <div id="landing_page">
                <h1>Anonymous </h1>
              </div>
        }
      </div>
    )
  }
}


// WutFace???? theres a better way to get props. but its 3AM and brain dead.

const mapStateToProps = (state) => {
  if(state.User.isAuthenticated){
    const {isAuthenticated,username,level,xp,skills} = state.User
    return {isAuthenticated,username,level,xp,skills}
  }else{
    const {isAuthenticated} = state.User
    return {
      isAuthenticated
    }
  }
}

const HomeContainer = connect(mapStateToProps)(Home)
export default HomeContainer

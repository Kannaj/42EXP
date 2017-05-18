import React from 'react';
import ProjectList from '../containers/ProjectList'
import { connect } from 'react-redux';
import user_add_skills from '../actions/User/actions.js'
import { bindActionCreators } from 'redux';
import LandingPage from '../components/LandingPage';
import PropTypes from 'prop-types';

export class Home extends React.Component{
  render(){
    return(
      <div>
        {
          this.props.isAuthenticated ?
            <ProjectList {...this.props} />
            :
            <LandingPage/>
        }
      </div>
    )
  }
}

Home.PropTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string
}

const mapStateToProps = (state) => {
  const { isAuthenticated, username } = state.User
  return {
    isAuthenticated,
    username
  }
}

const HomeContainer = connect(mapStateToProps)(Home)
export default HomeContainer

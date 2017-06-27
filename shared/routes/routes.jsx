import React from 'react';
import AppContainer from '../containers/App'
import HomeContainer from '../containers/Home'
import ProjectListContainer from '../containers/ProjectList';
import ProjectDetailContainer from '../containers/ProjectDetail';
import ProjectChatContainer from '../containers/ProjectChat';
import UserProfile from '../containers/UserProfile'
import { Route, IndexRoute } from 'react-router';
import About from '../components/About';
import TOS from '../components/tos';
import PrivacyPolicy from '../components/privacy';

export default(
  <Route path="/" component={AppContainer} >
    <IndexRoute component={HomeContainer}/>
    <Route path="about" component={About} />
    <Route path="tos" component={TOS} />
    <Route path="privacy" component={PrivacyPolicy} />
    <Route path="projects" component={ProjectListContainer}/>
    <Route path="projects/:projectId/:projectName" component={ProjectDetailContainer}/>
    <Route path="projects/:projectId/:projectName/messages" component={ProjectChatContainer} />
    <Route path ="user/:username" component={UserProfile} />
  </Route>
)

import React from 'react';
import AppContainer from '../containers/App'
import HomeContainer from '../containers/Home'
import ProjectListContainer from '../containers/ProjectList';
import ProjectDetailContainer from '../containers/ProjectDetail';
import ProjectChatContainer from '../containers/ProjectChat';
import UserProfileContainer from '../containers/UserProfile';
import UserDashboard from '../containers/UserDashboard';
import UserProfile_1 from '../containers/UserProfile_1'
import {Route,IndexRoute} from 'react-router';

export default(
  <Route path="/" component={AppContainer} >
    <IndexRoute component={HomeContainer}/>
    <Route path="projects" component={ProjectListContainer}/>
    <Route path="projects/:projectId/:projectName" component={ProjectDetailContainer}/>
    <Route path="projects/:projectId/:projectName/messages" component={ProjectChatContainer} />
    {/* <Route path ="user/:username" component={UserProfileContainer} /> */}
    <Route path ="user/:username" component={UserProfile_1} />
    <Route path = "user/dashboard" component={UserDashboard} />
  </Route>
)

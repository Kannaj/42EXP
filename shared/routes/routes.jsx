import React from 'react';
import AppContainer from '../containers/App'
import HomeContainer from '../containers/Home'
import ProjectList from '../components/ProjectList';
import ProjectDetailContainer from '../containers/ProjectDetail';
import ProjectChatContainer from '../containers/ProjectChat';
import {Route,IndexRoute} from 'react-router'

export default(
  <Route path="/" component={AppContainer} >
    <IndexRoute component={HomeContainer}/>
    <Route path="projects" component={ProjectList}/>
    <Route path="projects/:projectId" component={ProjectDetailContainer}/>
    <Route path="projects/:projectId/messages" component={ProjectChatContainer} />
  </Route>
)

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import { Router, Route, browserHistory ,IndexRoute} from 'react-router';
import { syncHistoryWithStore ,routerMiddleware} from 'react-router-redux'
import routes from '../shared/routes/routes';
import rootReducer from '../shared/reducers/index';
import style from './stylesheets/main.scss';
import SocketCluster from 'socketcluster-client';
import log_middleware from '../shared/middleware/log_middleware.js'
import thunk from 'redux-thunk';
import {new_chat_message} from '../shared/actions/projects/project_messages'
import {set_unread} from '../shared/actions/projects/set_unread'

const initialState = window.__INITIAL_STATE__

const middleware = routerMiddleware(browserHistory)

const createStoreWithMiddleware = applyMiddleware(log_middleware,thunk,middleware)(createStore);
const store = createStoreWithMiddleware(rootReducer,initialState)

const history = syncHistoryWithStore(browserHistory,store)

const options = {
  port: 8000
}

global.socket = SocketCluster.connect(options)

console.log(store.getState())

if(store.getState().Projects.length > 0){
  var projects = store.getState().Projects
  projects.map((project) => {
    socket.subscribe(project.id).watch(function(data){
      console.log('recieved message for :',project.id,' with data: ',data)
      // more to fill
      store.dispatch(new_chat_message(data))
    })
  })
}

history.listen((location) => {
  console.log('changed')
  let pattern = new RegExp('/projects/(\\d+)/messages');

  let url = location.pathname;

  let match = url.match(pattern);
  if (match){
    let projectid = parseInt(match[1])
    console.log('projectid is: ',projectid)
    store.dispatch(set_unread(projectid))
  }

})

socket.on('disconnect',function(){
  socket.send(window.location.href)
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
  ,document.getElementById('app')
)

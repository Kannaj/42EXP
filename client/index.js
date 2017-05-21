import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import routes from '../shared/routes/routes';
import rootReducer from '../shared/reducers/index';
import style from './stylesheets/main.scss';
import SocketCluster from 'socketcluster-client';
import log_middleware from '../shared/middleware/log_middleware.js'
import thunk from 'redux-thunk';
import { new_chat_message } from '../shared/actions/projects/project_messages';
import { set_unread } from '../shared/actions/projects/set_unread';
import { add_notification } from '../shared/actions/notifications/notifications';
import { update_user_stats } from '../shared/actions/User/actions';
import ReactGA from 'react-ga';

let port;

const initialState = window.__INITIAL_STATE__

const middleware = routerMiddleware(browserHistory)

const createStoreWithMiddleware = applyMiddleware(log_middleware,thunk,middleware)(createStore);
const store = createStoreWithMiddleware(rootReducer,initialState)

const history = syncHistoryWithStore(browserHistory,store)

if (process.env.NODE_ENV === 'production') {
  if (window.location.protocol === 'https:') {
    port = 443
  } else {
    port = 80
  }
} else {
  port = 8000
}

const options = {
  port
}

global.socket = SocketCluster.connect(options)

// is this safe to show in the code?
ReactGA.initialize('UA-99632194-1');

function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}



//subscribe to projects-channel of the user.
if(store.getState().Projects.length > 0){
  var projects = store.getState().Projects
  projects.map((project) => {
    // Watch for new messages on channel id and dispatch action when message recieved.
    socket.subscribe(project.id).watch(function(data){
      store.dispatch(new_chat_message(data))
    })
  })
}

//subscribe to users personal channel for notifications
if(store.getState().User.isAuthenticated){
  socket.subscribe(store.getState().User.username).watch(function(data){
    switch (data.type){
      case 'notification':
        store.dispatch(add_notification(Object.assign({},data.details,{server:true})))
        break;
      case 'update_stats':
        store.dispatch(update_user_stats(data))
        break;
      default:
        return ''
    }
  })
}

// Watch for url changes to specific project-chat rooms.
// On-click, dispatch an action to set unread_messages=0 for that particular project chat room.

history.listen((location) => {
  let pattern = new RegExp('/projects/(\\d+)/((?:[a-zA-Z0-9-_]|%20)+)/messages');
  let url = location.pathname;
  let match = url.match(pattern);
  if (match){
    let projectid = parseInt(match[1])
    store.dispatch(set_unread(projectid))
  }
})

socket.on('disconnect',function(){
  socket.send(window.location.href)
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} onUpdate={logPageView}>
      {routes}
    </Router>
  </Provider>
  ,document.getElementById('app')
)

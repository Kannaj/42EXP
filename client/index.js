import React from 'react';
import ReactDOM from 'react-dom';
// import App from '../shared/components/App';
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

const initialState = window.__INITIAL_STATE__

const middleware = routerMiddleware(browserHistory)

const createStoreWithMiddleware = applyMiddleware(log_middleware,thunk,middleware)(createStore);
const store = createStoreWithMiddleware(rootReducer,initialState)

const history = syncHistoryWithStore(browserHistory,store)

const options = {
  port: 8000
}

// if(store.getState().User.isAuthenticated){
//   global.socket = SocketCluster.connect(options)
// }

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

import {combineReducers} from 'redux';
import User from './User/UserReducer.js';
import Projects from './projects/projects.js';
import Notifications from './notifications/notifications';
import {routerReducer} from 'react-router-redux';
import loader from './loader'


const rootReducer = combineReducers({
  User,
  Projects,
  Notifications,
  loader,
  routing: routerReducer
})

export default rootReducer;

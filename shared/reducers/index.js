import {combineReducers} from 'redux';
import User from './User/UserReducer.js';
import Projects from './projects/projects.js';
import Notifications from './notifications/notifications';
import Flash_messages from './flash_messages/flash_messages';
import {routerReducer} from 'react-router-redux';
import loader from './loader'



const rootReducer = combineReducers({
  User,
  Projects,
  Notifications,
  Flash_messages,
  loader,
  routing: routerReducer
})

export default rootReducer;

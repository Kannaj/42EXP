import {combineReducers} from 'redux';
import User from './User/UserReducer.js';
import Projects from './projects/projects.js';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  User,
  Projects,
  routing: routerReducer
})

export default rootReducer;

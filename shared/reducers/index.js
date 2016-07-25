import {combineReducers} from 'redux';
import User from './User/UserReducer.js';
import Projects from './projects/projects.js';
import {routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  User,
  Projects,
  form: formReducer,
  routing: routerReducer
})

export default rootReducer;

import {SET_LAST_ACTIVITY} from './constants';

export const set_last_activity = (data) => {
  return function (dispatch){
    dispatch({
      type:SET_LAST_ACTIVITY,
      data
    })
  }
}

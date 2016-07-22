import {SET_UNREAD} from './constants'

export const set_unread = (id) => {
  return function(dispatch){
    dispatch({
      type: SET_UNREAD,
      id
    })
  }
}

import * as constants from './constants.js';

export const add_notification = (messageDetails) => {
  return {
    type: constants.ADD_NOTIFICATION,
    messageDetails
  }
}

export const remove_notification = (messageId,server) => {
  return {
    type: constants.CLOSE_NOTIFICATION,
    messageId,
    server
  }
}

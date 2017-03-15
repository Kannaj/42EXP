import * as constants from './constants.js';

export const add_notification = (messageDetails) => {
  return {
    type: constants.ADD_NOTIFICATION,
    messageDetails
  }
}

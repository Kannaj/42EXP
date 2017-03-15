import * as constants from './constants.js';

export const add_message = (messageDetails) => {
  return {
    type: constants.ADD_MESSAGE,
    messageDetails
  }
}

export const remove_message = (messageId) => {
  return {
    type: constants.REMOVE_MESSAGE,
    messageId
  }
}

export const START_REQUEST = 'START_REQUEST';
export const STOP_REQUEST = 'STOP_REQUEST';

export const start_request = () => {
  return {
    type: START_REQUEST
  }
}

export const stop_request = () => {
  return {
    type: STOP_REQUEST
  }
}

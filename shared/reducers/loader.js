import {START_REQUEST,STOP_REQUEST} from '../actions/loader';

const loader = (state={loading:false},action) => {
  switch (action.type){
    case START_REQUEST:
      return Object.assign({},state,{loading:true})
    case STOP_REQUEST:
      return Object.assign({},state,{loading:false})
  }
  return state
}

export default loader

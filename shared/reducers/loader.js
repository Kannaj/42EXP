import {START_REQUEST,STOP_REQUEST} from '../actions/loader';
console.log('START_REQUEST: ',START_REQUEST);

const loader = (state={loading:false},action) => {
  switch (action.type){
    case START_REQUEST:
      console.log('started loader......')
      return Object.assign({},state,{loading:true})
    case STOP_REQUEST:
      console.log('state is now : ',state)
      return Object.assign({},state,{loading:false})
  }
  return state
}

export default loader

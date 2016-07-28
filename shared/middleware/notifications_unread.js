import {CLOSE_NOTIFICATION} from '../actions/notifications/constants'

export default store => next => action => {
  if(action.type == CLOSE_NOTIFICATION && action.server){
    if(socket){
      socket.emit('set_notification',{id:action.messageId},function(err,response){
        if(err){
          console.log('there was an error')
        }else{
          return next(action)
        }
      })
    }
  }
  return next(action)
}

export default store => next => action => {
  if(process.env.NODE_ENV==='production'){
    return next(action)
  }else{
    console.log('Middleware hit:',action.type)
    return next(action)
  }
}

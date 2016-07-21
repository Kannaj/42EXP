

export default store => next => action => {
  console.log('Middleware hit:',action.type)
  return next(action)
}

const validate = values => {
  const errors = {}
  if(!values.name || /\s/.test(values.name)){
    errors.name = 'Please provide a proper name without spaces'
  }
  if(!values.description){
    errors.description = 'Required'
  }
  if(!values.category){
    errors.category = 'Required'
  }
  return errors;
}

export default validate;

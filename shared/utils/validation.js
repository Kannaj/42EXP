const validate = values => {
  const errors = {}
  let url = new RegExp("^https?://([a-z0-9-]+\.)*(github)\.com(/.*)?$")
  if(!values.name || /\s/.test(values.name)){
    errors.name = 'Please provide a proper name without spaces'
  }
  if(values.link){
    // console.log(values.link.match(url))
    let provider = values.link.match(url)
    // console.log(provider)
    if (provider == null || !provider[1] == 'github'){
      errors.link = "Url must be a fully valid github url (be sure to include https as well)"
    }
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

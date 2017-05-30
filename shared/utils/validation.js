const validate = values => {
  const errors = {}
  let github_url = new RegExp("^https?://([a-z0-9-]+\.)*(github)\.com(/.*)?$")
  if(!values.name || !/^[a-zA-Z0-9-\s]*$/.test(values.name) || values.name.length > 40 ){
    errors.name = 'Please provide a proper name (max chars at 40) without special characters'
  }
  if(values.github_link){
    let provider = values.github_link.match(github_url)
    if (provider == null || !provider[1] == 'github'){
      errors.github_link = "Url must be a fully valid github url (be sure to include https as well)"
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

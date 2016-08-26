const validate = values => {
  const errors = {}
  let github_url = new RegExp("^https?://([a-z0-9-]+\.)*(github)\.com(/.*)?$")
  let reddit_url = new RegExp("^https?://([a-z0-9-]+\.)*(reddit)\.com(/r/42exp)(/.*)?$")
  if(!values.name || /\s/.test(values.name) || !/^[a-zA-Z0-9-_]*$/.test(values.name)){
    errors.name = 'Please provide a proper name without spaces and no special characters'
  }
  if(values.github_link){
    let provider = values.github_link.match(github_url)
    if (provider == null || !provider[1] == 'github'){
      errors.github_link = "Url must be a fully valid github url (be sure to include https as well)"
    }
  }
  if(values.reddit_link){
    let reddit = values.reddit_link.match(reddit_url)
    if(reddit==null || !reddit[1] === 'reddit' || !reddit[2] === '/r/42exp'){
      errors.reddit_link = "Url must be a valid link to the 42exp subreddit!"
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

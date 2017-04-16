const slugify = (type,state) => {
  switch (type) {
    case "slugify":
        const slug = state.name.replace(/\s/g,'_')
        return Object.assign({},state,{name: slug})
      break;
    case "deslugify":
        return state.replace(/_/g,' ')
      break;
    default:
      return state
  }

}

export default slugify;

// slugify recives an entire object and replaces the name key whereas deslugify recieves a string

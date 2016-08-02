const user_profile_cleaner = (user) => {
  if(user.skills[0].id === null){
    user.skills = []
  }
  return user;
}

export default user_profile_cleaner;

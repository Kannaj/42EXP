const invert_message_list = (projects) => {
  projects.map((project) => {
    project.messages.reverse()
  })
  return projects;
}

export default invert_message_list;

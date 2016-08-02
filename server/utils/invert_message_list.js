const invert_message_list = (projects) => {
  projects.map((project) => {
    project.messages.reverse()
  })

  console.log('projects.messages',projects[0].messages)
  return projects;
}

export default invert_message_list;

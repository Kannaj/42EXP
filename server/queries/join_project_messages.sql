INSERT INTO project_messages (project,message,username,message_type)
  values ($1,$2,$3,$4) returning *

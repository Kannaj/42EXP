INSERT INTO project_tasks
  (
    project,
    name,
    description,
    completed
  )

VALUES ($1, $2, $3, false) returning *

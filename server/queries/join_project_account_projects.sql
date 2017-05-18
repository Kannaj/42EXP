INSERT INTO account_projects (username,project,role)
  values ($1,$2,$3) returning *

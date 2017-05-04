DELETE FROM project_skills
  WHERE project = (SELECT name from project where id = $1) returning *

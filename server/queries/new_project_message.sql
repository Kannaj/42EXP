INSERT INTO project_messages (project,message,username,timestamp)
  VALUES ((SELECT name FROM project WHERE id=$1),$2,$3,$4) 
returning *

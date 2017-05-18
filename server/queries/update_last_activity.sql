UPDATE account_projects
  SET last_activity = Now()
  WHERE username=$1 AND project=(SELECT name from project where id = $2)
  returning last_activity

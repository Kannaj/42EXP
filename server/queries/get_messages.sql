SELECT
  id,
  message,
  username,
  timestamp,
  message_type 
FROM project_messages
WHERE project=(SELECT name from project WHERE id = $1)
ORDER BY timestamp DESC LIMIT 10;

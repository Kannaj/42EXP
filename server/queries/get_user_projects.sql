
-- v2 - with initial order limit

SELECT project.id,ap.project,ap.last_activity,ap.role,
get_unread_messages(project.id,ap.last_activity) AS unread_messages
FROM account_projects ap
LEFT JOIN project ON ap.project = project.name
WHERE ap.username = $1
GROUP BY project.id,ap.project,ap.last_activity,ap.role ORDER by id;

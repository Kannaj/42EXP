
SELECT ap.id,ap.project,ap.last_activity,ap.role,array_agg(json_build_object('id',pm.id,'message',pm.message)) AS messages
FROM account_projects ap
LEFT JOIN project_messages pm ON ap.project = pm.project
WHERE ap.username = $1
GROUP BY ap.id,ap.project,ap.last_activity,ap.role;

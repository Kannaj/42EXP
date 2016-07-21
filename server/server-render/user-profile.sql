-- This query gets the profile details of the user which will be used in UserDashboard.jsx
-- if the user does not have any skills yet . the query returns a null json object thing which needs to be properly cleaned up

SELECT account.username,xp,level,array_agg(json_build_object('id',ask.id,'skill',ask.skill,'commends',ask.commends)) AS skills
FROM account
LEFT OUTER JOIN Account_skills ask on account.username = ask.username
WHERE account.username= $1 GROUP BY account.username,xp,level;

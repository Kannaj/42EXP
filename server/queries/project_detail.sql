select p.id AS id,
      p.name as name,
      p.github_link as github_link,
      p.description as description,
      p.category as category,
      p.owner as owner,
      (
        SELECT array_agg(json_build_object('skill_id',s.id,'name',s.skill)) AS skills
        from project_skills s
        where s.project = p.name
      ) AS skills,
      (
        SELECT array_agg(json_build_object('role',ap.role,'name',ap.Username)) AS members
        from account_projects ap
        where ap.project = p.name
      ) as members
from project p
where p.id = $1;

INSERT INTO project (name,category,description,github_link,owner, pinned)
  VALUES (${name},${category},${description},${github_link},${username}, ${pinned})
  returning *

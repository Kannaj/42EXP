select name from project
  where LOWER(name) like LOWER('$1#')

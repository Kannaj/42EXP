UPDATE project_tasks SET name=$1, description=$2 WHERE id=$3 returning *

UPDATE project SET name=$1,description=$2,github_link=$3,category=$4 WHERE id=$5 returning *

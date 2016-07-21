// This file sets up the pg-promise database connector

var pgp = require('pg-promise')();

var cn = process.env.DATABASE_URL

export const db = pgp(cn)

function sql(file) {
    return new pgp.QueryFile(file, {minify: true});
}

export const queries = {
  UserProfile : sql('/home/avernus/Desktop/Xanadu/server/server-render/user-profile.sql'),
  ProjectList: sql('/home/avernus/Desktop/Xanadu/server/queries/project_list.sql'),
  ProjectDetail : sql('/home/avernus/Desktop/Xanadu/server/queries/project_detail.sql'),
  UserProjects: sql('/home/avernus/Desktop/Xanadu/server/queries/get_user_projects.sql')
}

// sql () requires the full project path of the sql file. otherwise it looks for the node_modules folder

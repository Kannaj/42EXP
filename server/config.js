// This file sets up the pg-promise database connector
import path from 'path';
var pgp = require('pg-promise')();


if(process.env.NODE_ENV === 'testing'){
  var cn = process.env.TEST_DATABASE_URL
}else{
  var cn = process.env.DATABASE_URL
}

export const db = pgp(cn)

function sql(file) {
    return new pgp.QueryFile(file, {minify: true});
}

export const queries = {
  UserProfile:sql(path.join(__dirname,'/server-render/user-profile.sql')),
  ProjectList:sql(path.join(__dirname,'queries/project_list.sql')),
  ProjectDetail : sql(path.join(__dirname,'queries/project_detail.sql')),
  UserProjects:sql(path.join(__dirname,'queries/get_user_projects.sql')),
  UserNotifications: sql(path.join(__dirname,'queries/get_user_notifications.sql')),
  GetMoreMessages: sql(path.join(__dirname,'queries/get_more_messages.sql'))
}

// sql () requires the full project path of the sql file. otherwise it looks for the node_modules folder

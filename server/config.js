// This file sets up the pg-promise database connector
import path from 'path';
import monitor from 'pg-monitor'

var options = {}

var pgp = require('pg-promise')(options);

if(process.env.NODE_ENV === 'testing'){
  var cn = process.env.TEST_DATABASE_URL
}else{
  var cn = process.env.DATABASE_URL
}

monitor.setTheme('bright');

monitor.attach(options,['query','error','connect'])

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
  GetMoreMessages: sql(path.join(__dirname,'queries/get_more_messages.sql')),
  GetMessages: sql(path.join(__dirname,'queries/get_messages.sql')),
  ProjectListPaginate: sql(path.join(__dirname,'queries/project_list_paginate.sql')),
  ProjectCheckName: sql(path.join(__dirname,'queries/project_check_name.sql')),
  JoinProjectAccountProjects: sql(path.join(__dirname,'queries/join_project_account_projects.sql')),
  JoinProjectMessages: sql(path.join(__dirname,'queries/join_project_messages.sql')),
  UpdateLastActivity: sql(path.join(__dirname,'queries/update_last_activity.sql')),
  CreateNewProject: sql(path.join(__dirname,'queries/create_new_project.sql')),
  CreateAccountProjects: sql(path.join(__dirname,'queries/create_account_projects.sql')),
  CreateProjectSkills: sql(path.join(__dirname,'queries/create_project_skills.sql')),
  DeleteProjectSkills: sql(path.join(__dirname,'queries/delete_project_skills.sql')),
  UpdateProject: sql(path.join(__dirname,'queries/update_project.sql')),
  ProjectMemberList: sql(path.join(__dirname,'queries/project_member_list.sql')),
  NewProjectMessage: sql(path.join(__dirname,'queries/new_project_message.sql')),
  VoteNotification: sql(path.join(__dirname,'queries/vote_notification.sql')),
  SetToReadNotification: sql(path.join(__dirname,'queries/set_to_read_notification.sql')),
  FilterPinnedProjects: sql(path.join(__dirname,'queries/project_filter_pinned.sql')),
  SearchProjectBySkill: sql(path.join(__dirname,'queries/project_filter_by_skill.sql')),
  SearchProjectBySkillPaginate: sql(path.join(__dirname,'queries/project_filter_by_skill_paginate.sql')),
  GetProjectTasks: sql(path.join(__dirname,'queries/get_project_tasks.sql')),
  AddProjectTasks: sql(path.join(__dirname,'queries/project_add_task.sql')),
  EditProjectTasks: sql(path.join(__dirname,'queries/edit_project_task.sql')),
  DeleteProjectTasks: sql(path.join(__dirname,'queries/delete_project_task.sql')),
}

exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Project_skills(
      id SERIAL PRIMARY KEY,
      Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
      Skill VARCHAR REFERENCES skill (name),
      UNIQUE(Project,Skill)
    );

    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE project_skills`)
};

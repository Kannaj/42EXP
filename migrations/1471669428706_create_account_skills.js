exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Account_skills(
      id SERIAL PRIMARY KEY,
      Username VARCHAR REFERENCES Account (Username),
      Skill VARCHAR REFERENCES skill (name),
      Commends INTEGER DEFAULT 0,
      UNIQUE(Username,skill)
    );

    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE account_skills`)
};

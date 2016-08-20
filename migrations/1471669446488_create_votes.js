exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS VOTES(
      id SERIAL PRIMARY KEY,
      Voter VARCHAR REFERENCES Account(Username),
      Votee VARCHAR REFERENCES Account(Username),
      skill INTEGER REFERENCES Account_skills (id),
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (Voter,Votee,skill)
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE votes`)
};

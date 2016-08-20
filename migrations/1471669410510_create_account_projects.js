exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Account_Projects(
      id SERIAL PRIMARY KEY,
      Username VARCHAR REFERENCES Account (Username),
      Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
      Join_date TIMESTAMPTZ DEFAULT NOW(),
      ROLE VARCHAR(10),
      Last_activity TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(Username,Project)
    );

    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE account_projects`)
};

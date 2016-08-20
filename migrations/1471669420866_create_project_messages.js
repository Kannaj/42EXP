exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Project_Messages(
      id SERIAL PRIMARY KEY,
      Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
      Message Text,
      Username VARCHAR REFERENCES Account (Username),
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE project_messages`)
};

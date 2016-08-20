exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Project(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE,
      Owner VARCHAR REFERENCES Account (Username) ON UPDATE CASCADE ON DELETE CASCADE,
      Description text,
      Link VARCHAR,
      Category VARCHAR REFERENCES Category (name) ,
      Create_date TIMESTAMPTZ DEFAULT NOW()
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE project`)
};

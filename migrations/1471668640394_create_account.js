exports.up = function(pgm) {
  pgm.sql(
    `CREATE TABLE Account(
      id SERIAL PRIMARY KEY,
      Username VARCHAR(40) UNIQUE,
      Email VARCHAR(40) UNIQUE,
      Password VARCHAR,
      Join_date TIMESTAMPTZ DEFAULT NOW(),
      XP INTEGER DEFAULT 0,
      Level Integer DEFAULT 1,
      Provider VARCHAR,
      is_admin BOOLEAN DEFAULT FALSE
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE account`)
};

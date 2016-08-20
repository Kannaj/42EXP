exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Category(
      id SERIAL PRIMARY KEY,
      name VARCHAR(25) UNIQUE
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE category`)
};

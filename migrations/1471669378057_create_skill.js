exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE TABLE IF NOT EXISTS Skill(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) UNIQUE
    );
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE skill`)
};

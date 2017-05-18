exports.up = function(pgm) {
  pgm.sql(
    `
      ALTER TABLE Project
      ADD COLUMN pinned BOOLEAN DEFAULT FALSE
    `
  )
};

exports.down = function(pgm) {

};

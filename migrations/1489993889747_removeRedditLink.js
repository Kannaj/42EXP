exports.up = function(pgm) {
  pgm.sql(
    `
      ALTER TABLE Project DROP COLUMN IF EXISTS reddit_link
    `
  )
};

exports.down = function(pgm) {

};

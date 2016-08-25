exports.up = function(pgm) {
  pgm.sql(
    `
    ALTER TABLE Project RENAME link to github_link
    `
  )
  pgm.sql(
    `
    ALTER TABLE Project ADD column reddit_link varchar
    `
  )
};

exports.down = function(pgm) {

};

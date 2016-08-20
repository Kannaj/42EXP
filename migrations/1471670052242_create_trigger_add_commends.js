exports.up = function(pgm) {
  pgm.sql(
    `
      CREATE TRIGGER add_commends AFTER INSERT ON votes FOR EACH ROW EXECUTE PROCEDURE add_commends();
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TRIGGER add_commends`)
};

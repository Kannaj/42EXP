exports.up = function(pgm) {
  pgm.sql(
    `
      CREATE TRIGGER set_user_level BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE set_user_level();
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TRIGGER set_user_level`)
};

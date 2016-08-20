exports.up = function(pgm) {
  pgm.sql(
    `
    CREATE OR REPLACE FUNCTION add_commends() RETURNS TRIGGER AS $$

      BEGIN

      UPDATE Account_skills set commends = commends + 1 WHERE id = NEW.skill;

      RETURN NEW;
      END;
    $$ LANGUAGE plpgsql;
    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP FUNCTION add_commends`)
};

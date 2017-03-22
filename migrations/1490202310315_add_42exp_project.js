exports.up = function(pgm) {
  pgm.sql(
    "INSERT INTO project (name) VALUES ('42exp') "
  )
};

exports.down = function(pgm) {

};


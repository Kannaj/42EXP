exports.up = function(pgm) {
  pgm.sql(
    `
    ALTER TABLE Project_Messages
    ADD column message_type VARCHAR DEFAULT 'message'
    `
  )
};

exports.down = function(pgm) {

};

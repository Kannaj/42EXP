var fs = require('fs');
var path = require('path')

exports.up = function(pgm) {
  var skill_list = fs.readFileSync(path.join(__dirname+'/initial_data/skill_list.txt')).toString().split('\r\n');
  for (var i = 0;i<skill_list.length-1;i++){
    pgm.sql(
      "INSERT INTO SKILL (name) values (\'{skill}\')",{skill:skill_list[i]}
    )
  }
};

exports.down = function(pgm) {
  pgm.sql(`DELETE FROM skill`)
};

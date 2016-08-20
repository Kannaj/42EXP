var fs = require('fs');
var path = require('path')

exports.up = function(pgm) {
  var category_list = fs.readFileSync(path.join(__dirname+'/initial_data/category-list.txt')).toString().split('\n');
  console.log(category_list)
  for (var i = 0;i<category_list.length-1;i++){
    pgm.sql(
      "INSERT INTO category (name) values (\'{category}\')",{category:category_list[i]}
    )
  }
};

exports.down = function(pgm) {
  pgm.sql(`DELETE FROM category`)
};

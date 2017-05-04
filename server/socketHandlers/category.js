import {db} from '../config.js'

export const category_suggestions = function(data){
  db.any("SELECT * from category WHERE LOWER(name) LIKE LOWER('%$1#%')",data.category)
    .then((category) => {
      // res(null,category)
      return category
    })
    .catch((err) => {
      return 'No suggestions recieved for category'
    })
}

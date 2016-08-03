import {db} from '../config.js'

export const category_suggestions = function(data,res){
  //console.log('recieved data: ',data)
  db.any("SELECT * from category WHERE LOWER(name) LIKE LOWER('%$1#%')",data.category)
    .then((category) => {
      res(null,category)
    })
    .catch((err) => {
      res(err.message)
    })
}

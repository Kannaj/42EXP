import {db} from '../config.js'

// es6 cant be used here. lexical scoping -> this refers to skill_suggestions & not socket instance.
// use 'function'

export const skill_suggestions = function(data,res) {
  //console.log('recieved data : ',data)
  db.any("SELECT * from skill WHERE LOWER(name) LIKE LOWER('%$1#%')",data.skill)
    .then((skill) => {
      //console.log('skill_suggestions : ',skill)
      res(null,skill)
    })
    .catch((err) => {
      //console.log('error : ',err)
      res(err.message)
    })
}

export const skill_user = function(data){
  return db.any("Insert into account_skills (username,skill) values ($1,$2) returning *",[data.username,data.value])
    .then(function(result){
      // res(null,result)
      // console.log(result)
      return result
    })
    .catch(function(err){
      // console.log('There was an error : ',err.message)
      // res('Could not insert skill - try again!')
      throw 'Could not insert skill - try again!'
    })
}

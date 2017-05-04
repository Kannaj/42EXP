import {db} from '../config.js'
import winston from 'winston';

export const skill_suggestions = function(data,res) {
  db.any("SELECT * from skill WHERE LOWER(name) LIKE LOWER('%$1#%')",data.skill)
    .then(function(skill){
      return skill
    })
    .catch(function(err){
      return err
    })
}

export const skill_user = function(data){
  return db.any("Insert into account_skills (username,skill) values ($1,$2) returning *",[data.username,data.value])
    .then(function(result){
      return result
    })
    .catch(function(err){
      winston.error('Skill couldnt be added for user : ',err)
      throw 'Could not insert skill - try again!'
    })
}

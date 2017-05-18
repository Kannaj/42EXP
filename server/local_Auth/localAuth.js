import bcrypt from 'bcrypt-nodejs';
import jwtSign from './jwt.js';
import { db } from '../config.js';
import { join_project } from '../socketHandlers/project.js';
// Error messages are not properly sent res.status(400).send(body). body object is not parsed by superagent on the client.

export const Register = (req,res) => {
  const hash = bcrypt.hashSync(req.body.password.trim(),bcrypt.genSaltSync(10))
  return db.tx((t) => {
    t.one('insert into account(username,password,email) values ($1,$2,$3) returning * ', [req.body.username,hash,req.body.email])
      .then((user) => {
        join_project({ id: 1, username: user.username, project: "42exp" })
          .then((projectResults) => {
            console.log('user : ',user, ' projectResults: ',projectResults)
            return user
          })
          return user
      })
      .then((user) => {
        const id_token = jwtSign(user);
        res.cookie('id_token',JSON.stringify(id_token),{ expires: new Date(Date.now() + (24 * 60 * 60 * 1000 * 30 * 12 * 10)), httpOnly: true })
        res.status(200).send("Registration Success")
      })
      .catch((err) => {
        res.status(401).send("Registration Unsuccessful")
      })
  })
}

export const Login = (req,res) => {
  db.one('SELECT * FROM account WHERE username = $1',req.body.username)
    .then((details) => {
      const pass = bcrypt.compareSync(req.body.password,details.password)
      if(pass){
        const id_token = jwtSign(details)
        res.cookie('id_token',JSON.stringify(id_token),{ expires: new Date(Date.now() + (24 * 60 * 60 * 1000 * 30 * 12 * 10)), httpOnly: true })
        res.status(200).send({status:'Login Success'})
      }else{
        console.log('Pass doesnt match')
        res.status(401).send("Password doesnt match")
      }
    })
    .catch((err) => {
      res.status(401).send("Username does not exist")
    })
}

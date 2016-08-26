import bcrypt from 'bcrypt-nodejs'
import jwtSign from './jwt.js'
import {db} from '../config.js'

// Error messages are not properly sent res.status(400).send(body). body object is not parsed by superagent on the client.

export const Register = (req,res) => {
  console.log('req: ',req.body)
  const hash = bcrypt.hashSync(req.body.password.trim(),bcrypt.genSaltSync(10))
  db.one('insert into account(username,password,email) values ($1,$2,$3) returning * ',[req.body.username,hash,req.body.email])
    .then((result) => {
      const id_token = jwtSign(result)
      console.log('id_token: ',id_token)
      res.cookie('id_token',JSON.stringify(id_token),{ expires: new Date(Date.now() + (24 * 60 * 60 * 1000 * 30 * 12 * 10)), httpOnly: true })
      // res.send(null,{'status':'Registration success'})
      res.status(200).send("Registration Success")
    })
    .catch((err) => {
      console.log('There was an error: ',err)
      // res.send({status:'Error',message:'Registration Unsuccessful'})
      res.status(401).send("Registration Unsuccessful")
    })
}

export const Login = (req,res) => {
  db.one('SELECT * FROM account WHERE username = $1',req.body.username)
    .then((details) => {
      const pass = bcrypt.compareSync(req.body.password,details.password)
      if(pass){
        console.log('pass matches')
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

const githubStrategy = require('passport-github').Strategy
import passport from 'passport';
import {db,sql} from '../config.js';
import jwtSign from '../local_Auth/jwt.js';
import winston from 'winston';

passport.use(new githubStrategy({
  clientID:process.env.GITHUB_CLIENT_ID,
  clientSecret:process.env.GITHUB_CLIENT_SECRET,
  // callbackURL:'http://localhost:8000/auth/github/callback',
  callbackURL:'/auth/github/callback',
  scope: [ 'user:email' ]
  },
  function(accessToken,refreshToken,profile,done){
    //check if user exists
    db.one('SELECT * FROM account where username= $1',profile.username)
      .then((result) => {
        //user already exists - just retrieve profile and sign jwt token and send back
        profile.token = jwtSign(result)
        return done(null,profile)
      })
      .catch((err) => {
        //user doesnt exist - create new user
        winston.error('there was an error: ',err)
        // temporary hack - would prefer to insert provider value automatically
        let provider = "Github"
        db.one('INSERT INTO account (username,email,provider) values ($1,$2,$3) returning *',[profile.username,profile.emails[0].value,provider])
          .then((result) => {
            // console.log('successfully registered user : ',result)
            winston.info('User registered : ',result)
            profile.token = jwtSign(result)
            return done(null,profile)
          })
          .catch((err) => {
            winston.error('There was an error with user registration: ',err,' profile ')
            return done(err)
          })
      })
    }
  ))

module.exports = passport;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const bcrypt = require('bcrypt');
require('dotenv').config();


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
      done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://authentication-and-authorization-k6pd.onrender.com/auth/google/callback",
    passReqToCallback   : true
  },
   async function(request, accessToken, refreshToken, profile, done) {
    //  console.log(profile)
    // return done(null, profile);
    
      try {

        const existingUser = await User.findOne({ email: profile.email })
        if(existingUser){
          return done(null, existingUser)
        }

        const user = {
          username: profile.given_name,
          email: profile.email,
          password: profile.id
        }

        // return console.log(profile)
        const savedUser = await new User(user)
        .save()
        
        .then((user) => {
          return done(null, user)
        }).catch((err) => {
          console.log(err.message)
        })
       
      } catch (err) {
        return done(err.message);
      }
      // return done(err, user);
    
  }
));
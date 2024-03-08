const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/user')
require('dotenv').config()

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
        done(null, user);
  });

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://authentication-and-authorization-k6pd.onrender.com/auth/github/callback"
  },
   async function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    try {
        const existingUser = await User.findOne({ email: profile._json.email })
        if(existingUser){
            return done(null, existingUser)
        }

        const user = {
            username: profile.username,
            email: profile._json.email,
            password: profile.id
        }
        // return console.log(user)
        const savedUser = await new User(user) 
        .save()
        return done(null, savedUser)
    } catch (err) {
        return done(err)
    }
  }
));
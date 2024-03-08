const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const userModel = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();


passport.use(
    new JwtStrategy(
        {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async function (token, done) {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        }
    )
);

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
    async (req, email, password, done) => {
        const { username } = req.body
        try {

            const existingUser = await userModel.findOne({ email })
            if (existingUser) {
                // console.log(existingUser)
                return done(null, existingUser)
            }
            
            const user = await userModel.create({ email, username, password })
            
            return done(null, user)

        } catch (err) {
           console.log(err)
           done(err)
        }
    }
    )
)

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);



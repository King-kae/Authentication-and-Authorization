const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const signup = async (req, res, next) => {
    res.send({
        success: true,
        message: 'Signup successful'
    })
}

const login = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        // return console.log(user)
        try{
            if (err){
                return next(err);
            }
            if (!user){
                return next(new Error('Username or password is incorrect'));
            }

            req.login(user, { session: false },
                async (error) => {
                    if (error){
                        return next(error);
                    }

                    const body = { id: user._id, email: user.email }

                    const token = jwt.sign({ body }, process.env.JWT_SECRET)

                    return res.json({ token })
                })
        } catch(error){
            return next(error);
        }
    })(req, res, next);
}


module.exports = { 
    signup,
    login
}
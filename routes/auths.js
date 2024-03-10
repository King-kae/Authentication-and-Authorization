const express = require('express');
const passport = require('passport');
const userModel = require('../models/user')
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();


authRouter.post(
    '/signup',
    passport.authenticate('signup', { session: false }), async (req, res, next) => {
        console.log(req.user)
        const body = { _id: req.user._id, email: req.user.email, username: req.user.username };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        if (!token) {
            res.send({
                message: "Invalid token"
            })
        }
        res.render('lIndex', { user: req.user, token, success: null });
    }
);



authRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('Username or password is incorrect');
                    return next(error);
                }


                req.login(user, { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email, username: user.username };
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
                        console.log(token)
                        return res.render('lIndex', { user, token, success: null });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);



module.exports = authRouter
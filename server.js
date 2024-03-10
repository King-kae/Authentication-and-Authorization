const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const db = require('./db/db')
const cors = require('cors')
const passport = require('passport')
require('dotenv').config()
const PORT = 8000
const authRoute = require('./routes/auths')
const bookRoute = require('./routes/books.routes')


// connecting to the database
db.connectToMongoDB()

require('./authenticationssss/auth') // Signup and login authentication middleware
require('./authenticationssss/google') // Google authentication middleware
require('./authenticationssss/github') // Github authentication middleware

app.use(cors())

app.use('/style', express.static('style'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


app.set("views", "views")
app.set("view engine", "ejs")


// Google Authentication 
app.get("/success", (req, res) => {
    const body = { _id: req.user._id, email: req.user.email };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    })
    if (!token) {
        res.send({
            message: "Invalid token"
        })
    }
    console.log(req.user)
    res.render('lIndex', { user: req.user, token });
})

app.get("/failure", (req, res) => {
    res.send("Failed to authenticate");
})


app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })
);

// Github authentication
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/failed',
        successRedirect: '/github/success'
    })
);

app.get('/failed', function (req, res) {
    res.send('Failed')
})
app.get('/github/success', function (req, res) {
    const body = { _id: req.user._id, email: req.user.email };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    })
    if (!token) {
        res.send({
            message: "Invalid token"
        })
    }
    res.render('lIndex', { user: req.user, token });
})


app.use('/', authRoute)
app.use('/books', passport.authenticate('jwt', { session: false }), bookRoute)

// renders the home page
app.get('/', (req, res) => {
    res.render('index')
})

// renders the signup page
app.get('/signup', (req, res) => {
    res.render('signup')
})

// renders the login page
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/home', (req, res) => {
    res.render('lIndex', { error: null, success: null})
})

app.get('/books/?secret_token=:token', (req, res) => {
    res.render('books', { error: null, success: null})
})
// app.post('/books/?secret_token=:token', (req, res) => {
//     res.render('lIndex', { error: null, success: 'Book created successfully!' })
// })


app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { 
            return next(err); 
        }
        res.redirect('/');
    });
});


//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke!');
});


app.listen(PORT, (req, res) => {
    console.log(`listening on ${PORT}`)
})

module.exports = app
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
    res.render('signup');
});

// Register User
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        const newUser = new User({ username, email, password: hashedPassword });
        newUser.save()
            .then(() => res.redirect('/auth/login'))
            .catch(err => res.send(err));
    });
});
 
// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        res.redirect('/');
    });    
});

module.exports = router;

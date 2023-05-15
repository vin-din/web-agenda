const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isLoggedOut} = require('../lib/auth');

router.get('/signup', isLoggedOut, (req, res) =>{
    res.render('auth/signup');
});

router.post('/signup', isLoggedOut, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isLoggedOut, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isLoggedOut, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout',isLoggedIn, (req, res) => {
   
        req.logout(function(err){
            if(err){
                console.error(err);
                return res.status(500).send('¡¡Oh no!!');
            }
        });
        res.redirect('/signin');
});

module.exports = router;
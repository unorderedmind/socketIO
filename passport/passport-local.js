'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

//to save user id in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//to retrive user data from database
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//user verification in database
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email': email}, (err, user) => {
       if(err){
           return done(err);
       }

        if(user){
            return done(null, false, req.flash('error', 'User with email already exist'));
        }
        //save new user data in database
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));

// user sign in validation
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email': email}, (err, user) => {
       if(err){
           return done(err);
       }

       const messages = [];
       if(!user || !user.validUserPassword(password)){
           messages.push('Email Does Not Exist or Password is Invalid');
           return done(null, false, req.flash('error', messages));
       }

       return done(null, user);
        });
  }));

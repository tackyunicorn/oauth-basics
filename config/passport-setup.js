const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user-model')


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for the strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ googleid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    googleid: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))
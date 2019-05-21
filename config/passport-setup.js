const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const InstagramStrategy = require('passport-instagram')
const User = require('../models/user-model')
var keys
try {
    keys = require('./keys')
} catch (e) {
    keys = {
        google: {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        facebook: {
            clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL
        },
        instagram: {
            clientID: process.env.INSTAGRAM_OAUTH_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.INSTAGRAM_CALLBACK_URL
        },
        mongodb: {
            dbURI: process.env.MONGO_DB_URI
        },
        session: {
            cookieKey: process.env.COOKIE_KEY
        }
    }
}


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
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: keys.google.callbackURL
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

passport.use(
    new FacebookStrategy({
        // options for the strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: keys.facebook.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ facebookid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    facebookid: profile.id,
                    thumbnail: 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))

passport.use(
    new InstagramStrategy({
        // options for the strategy
        clientID: keys.instagram.clientID,
        clientSecret: keys.instagram.clientSecret,
        callbackURL: keys.instagram.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ instagramid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    instagramid: profile.id,
                    thumbnail: profile._json.data.profile_picture
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))
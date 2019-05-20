const express = require('express')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
var keys
try {
    keys = require('./config/keys')
} catch (e) {
    keys = {
        google: {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        mongodb: {
            dbURI: process.env.MONGO_DB_URI
        },
        session: {
            cookieKey: process.env.COOKIE_KEY
        }
    }
}

const app = express()
const port = process.env.PORT || 3000

// set up view engine
app.set('view engine', 'ejs')

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, {
    useNewUrlParser: true
},() => {
    console.log('connected to mongodb')
})

// set up routes
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

app.listen(port, () => {
    console.log('app listening on port ' + port)
})
const path = require('path')
const express = require('express')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const usersRoutes = require('./routes/users-routes')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
var keys
try {
    keys = require('./config/keys')
} catch (e) {
    keys = {
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

const viewsPath = path.join(__dirname, './templates/views')

// set up view engine
app.set('view engine', 'ejs')
app.set('views', viewsPath)

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
app.use('/users', usersRoutes)

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

app.listen(port, () => {
    console.log('app listening on port ' + port)
})
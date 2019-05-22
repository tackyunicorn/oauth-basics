const router = require('express').Router()
const User = require('../models/user-model')

const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect('/auth/login')
    } else {
        // if logged in
        next()
    }
}

router.get('/', authCheck, (req, res) => {
    User.find({}).then((users) => {
        res.render('users', { 
            user: req.user,
            users
        })
    })
})

module.exports = router
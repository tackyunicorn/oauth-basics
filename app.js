const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// set up view engine
app.set('view engine', 'ejs')

// create home route
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(port, () => {
    console.log('app listening on port ' + port)
})
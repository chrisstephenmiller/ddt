const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const db = require('./db')
const path = require('path')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'build')))
app.use('/api', require('./api'))
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build/index.html'))
  })
app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
})
db.sync({ force: true })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
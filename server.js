const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const logEvents = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500

// Simple custom logger
app.use((req, res, next) => {
  logEvents(`${req.method}  ${req.headers.origin}  ${req.url}`, 'requestLog.txt')
  console.log(`${req.method}\t${req.path}`)
  next()
})

// CORS
const allowedHosts = ['http://localhost:3500']
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedHosts.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))


app.get('^/$|/index(.html)?', (req, res) => {
  res.send('Hi')
})

app.get('/*', (req, res) => {
  res.status(404).send('Not Found')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


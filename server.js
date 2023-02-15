const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const logEvents = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500

// Simple custom logger
app.use((req, res, next) => {
  logEvents(`${req.method}  ${req.headers.origin}  ${req.url}`, 'requestLog.txt')
  console.log(`${req.method}\t${req.path}`)
  next()
})

// CORS
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


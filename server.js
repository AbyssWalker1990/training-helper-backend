require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDatabase = require('./config/connectDatabase')
const PORT = process.env.PORT || 3500

// Connect to database
connectDatabase()

// Simple custom logger
app.use(logger)

// Extra check before CORS
app.use(credentials)

// CORS
app.use(cors(corsOptions))

// Built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.send('404') // Switch to simple html page later
  } else if (req.accepts('html')) {
    res.json({ error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Successfully connected to database!')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})



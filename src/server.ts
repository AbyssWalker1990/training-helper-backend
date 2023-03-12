import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express'
const app = express()
import path from 'path'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import { logger } from'./middleware/logEvents'
import errorHandler from './middleware/errorHandler'
import credentials from './middleware/credentials'
import mongoose from 'mongoose'
import connectDatabase from './config/connectDatabase'
const PORT = process.env.PORT || 3500
import rootRouter from './routes/root'
import * as registerController from './controllers/authControllers/registerController'
import * as authController from './controllers/authControllers/authController'
import * as logoutController from './controllers/authControllers/logoutController'
import * as refreshTokenController from './controllers/authControllers/refreshTokenController'

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
app.use(express.static(path.join(__dirname, '..', '/public')))

// For refreshToken
app.use(cookieParser())

//routes
app.use('/', rootRouter)
app.use('/register', registerController.registerUser)
app.use('/auth', authController.handleLogin)
app.use('/refresh', refreshTokenController.handleRefreshToken)
app.use('/logout', logoutController.handleLogout)

app.all('*', (req: Request, res: Response) => {
  res.status(404)
  if (req.accepts('html')) {
    res.send('404') // Switch to simple html page later
  } else if (req.accepts('html')) {
    res.json({ error: "404 Not Found" })
  } else {
    res.type('txt').send("404 Not Found")
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Successfully connected to database!')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})



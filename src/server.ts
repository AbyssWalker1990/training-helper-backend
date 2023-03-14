import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import path from 'path'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import asyncMiddleware from './middleware/asyncMiddleware'
import { logger } from './middleware/logEvents'
import errorHandler from './middleware/errorHandler'
import credentials from './middleware/credentials'
import mongoose from 'mongoose'
import connectDatabase from './config/connectDatabase'
import rootRouter from './routes/root'
import registerRouter from './routes/auth/register'
import authRouter from './routes/auth/auth'
import refreshRouter from './routes/auth/refresh'
import logoutRouter from './routes/auth/logout'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
dotenv.config()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Training Helper API',
      version: '1.0.0',
      description: 'Simple app for training notes'
    },
    servers: [
      {
        url: 'http://localhost:3500'
      }
    ]
  },
  apis: ['./routes/auth/*.js']
}

const specs = swaggerJsDoc(options)

const app = express()

const PORT = process.env.PORT ?? 3500

// Connect to database
connectDatabase()

// Simple custom logger
app.use(asyncMiddleware(logger))

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

// routes
app.use('/', rootRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/register', registerRouter)
app.use('/auth', authRouter)
app.use('/refresh', refreshRouter)
app.use('/logout', logoutRouter)

app.all('*', (req: Request, res: Response) => {
  res.status(404)
  if (req.accepts('html') as boolean) {
    res.send('404') // Switch to simple html page later
  } else if (req.accepts('html') as boolean) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Successfully connected to database!')
  app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
})

import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import path from 'path'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler'
import credentials from './middleware/credentials'
import mongoose from 'mongoose'
import { connectDatabase } from './config/connectDatabase'
import rootRouter from './routes/root'
import authRouter from './routes/auth/auth'
import refreshRouter from './routes/auth/refresh'
import logoutRouter from './routes/auth/logout'
import trainingRouter from './routes/trainings/training'
import swaggerUI from 'swagger-ui-express'
import specsSwagger from './config/swaggerOptions'
import { logToConsoleAndFile, logFormat } from './config/morganOptions'
import morgan from 'morgan'
import moment from 'moment-timezone'
import App from './app'
import RegisterController from './controllers/authControllers/RegisterController'
dotenv.config()

const PORT = Number(process.env.PORT) ?? 3500
const app = new App([new RegisterController()], PORT)

moment.tz.setDefault('Europe/Kiev')

// Connect to database
connectDatabase()

mongoose.connection.once('open', () => {
  console.log('Successfully connected to database!')
  app.listen()
})

// routes
// app.use('/', rootRouter)
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specsSwagger))
// app.use('/register', registerRouter)
// app.use('/auth', authRouter)
// app.use('/refresh', refreshRouter)
// app.use('/logout', logoutRouter)
// app.use('/training', trainingRouter)

// app.all('*', (req: Request, res: Response) => {
//   res.status(404)
//   if (req.accepts('html') as boolean) {
//     res.send('404') // Switch to simple html page later
//   } else if (req.accepts('html') as boolean) {
//     res.json({ error: '404 Not Found' })
//   } else {
//     res.type('txt').send('404 Not Found')
//   }
// })

// app.use(errorHandler)

export default app

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDatabase } from './config/connectDatabase'

import moment from 'moment-timezone'
import App from './app'
import AuthController from './controllers/AuthController'
import SwaggerController from './controllers/SwaggerController'
import TrainingController from './controllers/TrainingController'
import TestController from './controllers/TestController'
dotenv.config()

const PORT = Number(process.env.PORT) ?? 3500
const app = new App([
  new AuthController(),
  new TrainingController(),
  new SwaggerController(),
  new TestController()
], PORT)

moment.tz.setDefault('Europe/Kiev')

// Connect to database
connectDatabase()

mongoose.connection.once('open', () => {
  console.log('Successfully connected to database!')
  app.listen()
})

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

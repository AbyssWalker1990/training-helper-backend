import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDatabase } from './config/connectDatabase'
import rootRouter from './routes/root'
import trainingRouter from './routes/trainings/training'
import swaggerUI from 'swagger-ui-express'
import specsSwagger from './config/swaggerOptions'

import moment from 'moment-timezone'
import App from './app'
import RegisterController from './controllers/authorizationControllers/RegisterController'
import AuthController from './controllers/authorizationControllers/AuthController'
import RefreshTokenController from './controllers/authorizationControllers/RefreshTokenController'
dotenv.config()

const PORT = Number(process.env.PORT) ?? 3500
const app = new App([
  new RegisterController(),
  new AuthController(),
  new RefreshTokenController()
], PORT)

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

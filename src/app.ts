import express from 'express'
import path from 'path'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import credentials from './middleware/credentials'
import morgan from 'morgan'
import { logFormat, logToConsoleAndFile } from './config/morganOptions'
import type Controller from './interfaces/controller.interface'
import errorMiddleware from './middleware/errorMiddleware'
import helmet from 'helmet'
import helmetOpt from './config/helmetOptions'

class App {
  public app: express.Application
  public port: number

  constructor (controllers: Controller[], port: number) {
    this.app = express()
    this.port = port

    this.initMiddlewares()
    this.initControllers(controllers)
    this.initErrorMiddleware()
  }

  private initMiddlewares (): void {
    this.app.use(morgan(logFormat, { stream: { write: logToConsoleAndFile } }))
    this.app.use(credentials)
    const cspMiddleware = helmet.contentSecurityPolicy(helmetOpt)
    this.app.use(cspMiddleware)
    this.app.use(cors(corsOptions))
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(cookieParser())
  }

  private initControllers (controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  private initErrorMiddleware (): void {
    this.app.use(errorMiddleware)
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`)
    })
  }

  public getServer (): express.Application {
    return this.app
  }
}

export default App

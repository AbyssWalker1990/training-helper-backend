import type Controller from '../interfaces/controller.interface'
import express, { type NextFunction, type Request, type Response } from 'express'
import TestService from '../services/test.services'

class TestController implements Controller {
  public path = '/test'
  public router = express.Router()
  public testService = new TestService()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.get(`${this.path}/create`, this.createRandomTraining)
  }

  private readonly createRandomTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {   
    try {
      const createdTraining = await this.testService.createRandomTraining('Vova')
      res.status(201).json({ success: `New Training ${createdTraining.title} created!!!` })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export default TestController

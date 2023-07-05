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
    this.router.get(`${this.path}/delete-all`, this.deleteTestTrainings)
  }

  private readonly createRandomTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      for (let i = 0; i < 30; i++) {
        await this.testService.createRandomTraining('Test')
      }
      res.status(201).json({ success: 'Test Trainings has been created!!!' })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  private readonly deleteTestTrainings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.testService.deleteAllTestTrainings()
      console.log('test Trainings deleted')
      res.status(204).json({ success: 'Test Trainings successfully deleted!' })
    } catch (error) {
      next(error)
    }
  }
}

export default TestController

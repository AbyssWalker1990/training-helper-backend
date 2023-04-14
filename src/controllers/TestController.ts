import type Controller from '../interfaces/controller.interface'
import express from 'express'

class TestController implements Controller {
  public path = '/test'
  public router = express.Router()

  constructor () {

  }

  public initRoutes (): void {
    this.router.get(`${this.path}/`, this.createRandomTraining)
  }

  private readonly createRandomTraining = (username: string): string => {
    const randomTraining = 'Training'
    return randomTraining
  }
}

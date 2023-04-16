import type Controller from '../interfaces/controller.interface'
import express, { type NextFunction, type Request, type Response } from 'express'
import { type TrainingModel } from '../interfaces/training.interface'
import TrainingService from '../services/trainings.service'

interface MyCookie {
  jwt: string
}

interface CustomRequest extends Request {
  cookies: MyCookie
}

class TrainingController implements Controller {
  public path = '/trainings'
  public router = express.Router()
  public trainingService = new TrainingService()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.post(`${this.path}/`, this.createTraining)
    this.router.get(`${this.path}/user`, this.getTrainingsByUser)
    this.router.get(`${this.path}/:trainingId`, this.getTrainingById)
    this.router.delete(`${this.path}/:trainingId`, this.deleteTraining)
  }

  private readonly createTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, title, exercises } = req.body 
      const newTraining = await this.trainingService.createSingleTraining(username, title, exercises)
      res.status(201).json({ success: `New Training ${newTraining.title} created!!!` })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  private readonly deleteTraining = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const cookies = req.cookies
      const trainingId = req.params.trainingId
      await this.trainingService.deleteSingleTraining(cookies, trainingId)
      res.status(204).json({ success: `Training ${trainingId} deleted!!!` })
    } catch (error) {
      next(error)
    }
  }

  private readonly getTrainingsByUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const cookies = req.cookies
    try {
      const trainingList = await this.trainingService.getAllTrainingsByUser(cookies)
      res.status(200).json(trainingList)
    } catch (error) {
      next(error)
    }
  }

  private readonly getTrainingById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const trainingId = req.params.trainingId
    try {
      const training = await this.trainingService.getSingleTrainingById(trainingId)
      res.status(200).json(training)
    } catch (error) {
      next(error)
    }
  }
}

export default TrainingController

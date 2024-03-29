import type Controller from '../interfaces/controller.interface'
import express, { type NextFunction, type Request, type Response } from 'express'
import TrainingService from '../services/trainings.service'

class TrainingController implements Controller {
  public path = '/trainings'
  public router = express.Router()
  public trainingService = new TrainingService()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.post(`${this.path}/`, this.createTraining)
    this.router.post(`${this.path}/user`, this.getTrainingsByUser)
    this.router.get(`${this.path}/:trainingId`, this.getTrainingById)
    this.router.patch(`${this.path}/:trainingId`, this.updateTraining)
    this.router.delete(`${this.path}/:trainingId`, this.deleteTraining)
  }

  private readonly createTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, title, exercises } = req.body
      const newTraining = await this.trainingService.createSingleTraining(username, title, exercises)
      res.status(201).json({ success: `New Training ${newTraining.title} created!!!`, newTraining })
    } catch (error) {
      next(error)
    }
  }

  private readonly updateTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const trainingId = req.params.trainingId
    const trainingData = req.body
    try {
      await this.trainingService.updateSingleTrainingById(trainingId, trainingData)
      res.status(201).json({ success: `Training ${trainingId} updated!!!` })
    } catch (error) {
      next(error)
    }
  }

  private readonly deleteTraining = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const cookies = req.cookies
      const trainingId = req.params.trainingId
      await this.trainingService.deleteSingleTraining(cookies, trainingId)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  private readonly getTrainingsByUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { token } = req.body
    try {
      const trainingList = await this.trainingService.getAllTrainingsByUser(token)
      res.status(200).json(trainingList)
    } catch (error: any) {
      next(error)
    }
  }

  private readonly getTrainingById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

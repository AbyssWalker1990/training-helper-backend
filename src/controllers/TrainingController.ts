import type Controller from '../interfaces/controller.interface'
import express, { type NextFunction, type Request, type Response } from 'express'

import { Training, type TrainingModel } from '../models/Training'
import { User, type UserModel } from '../models/User'
import TrainingService from '../services/trainings.service'
import { nextDay } from 'date-fns'

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
      const { username, title, exercises } = req.body as TrainingModel
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
    } catch (error) {
      next(error)
    }
  }

  private readonly getTrainingsByUser = async (req: CustomRequest, res: Response): Promise<any> => {
    const cookies = req.cookies
    if (cookies?.jwt === null) return res.sendStatus(401) // Unauthorized
    const accessToken = cookies.jwt
    console.log('ACCESS TOKEN: ' + accessToken)
    // Need to be replaced later with access token
    const currentUser = await User.findOne({ refreshToken: accessToken }).exec() as UserModel
    if (currentUser == null) return res.sendStatus(403) // Forbidden
    const currentUserName = currentUser.username

    try {
      const trainingList = await Training.find({ username: currentUserName })
      res.status(200).json(trainingList as TrainingModel[])
    } catch (error) {
      console.log(error)
    }
  }

  private readonly getTrainingById = async (req: CustomRequest, res: Response): Promise<any> => {
    const trainingId = req.params.trainingId
    if (trainingId == null || trainingId === undefined || trainingId === '') {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    try {
      const training = await Training.findById(trainingId) as TrainingModel
      if (training !== null && training !== undefined) {
        res.status(200).json(training)
      }
      console.log(training)
    } catch (error) {
      console.log(error)
    }
  }
}

export default TrainingController

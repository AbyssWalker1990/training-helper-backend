import { Training } from '../models/Training'
import MissingDataException from '../exceptions/trainingsExceptions/MissingDataException'
import type { Exercise, TrainingModel } from '../interfaces/training.interface'
import HttpException from '../exceptions/HttpException'
import { User } from '../models/User'
import jwt from 'jsonwebtoken'
import type { UserModel, MyCookie, DecodedToken } from '../interfaces/auth.interface'

class TrainingService {
  private readonly accessSecret: string
  constructor () {
    this.accessSecret = process.env.ACCESS_TOKEN_SECRET as string
  }

  public async createSingleTraining (username: string, title: string, exercises: Exercise[]): Promise<TrainingModel> {
    this.isValidTraining(username, title)
    const createdTraining = await Training.create({
      username,
      title,
      exercises
    })
    return createdTraining
  }

  public async deleteSingleTraining (cookies: MyCookie, trainingId: string): Promise<void> {
    this.isAccessToken(cookies)
    const accessToken = cookies.jwt
    const currentUser = await this.isExistingUser(accessToken)
    const currentUserName = currentUser.username
    const training = await Training.findById(trainingId) as TrainingModel
    if (training === null) {
      throw new MissingDataException(`There is no training with ${trainingId} ID`)
    }
    this.isOwnerOfTraining(training, currentUserName)
    await Training.findByIdAndDelete(trainingId)
  }

  public async getAllTrainingsByUser (cookies: MyCookie): Promise<TrainingModel[]> {
    this.isAccessToken(cookies)
    const accessToken = cookies.jwt
    console.log('accessToken: ', accessToken)
    const currentUser = await this.decodeUserName(accessToken, this.accessSecret)
    const trainingList = await Training.find({ username: currentUser.username })
    console.log('trainingList: ', trainingList)
    return trainingList
  }

  public async getSingleTrainingById (trainingId: string): Promise<TrainingModel> {
    this.isValidTrainingId(trainingId)
    const training = await Training.findById(trainingId) as TrainingModel
    if (training === null) {
      throw new MissingDataException(`There is no training with ${trainingId} ID`)
    }
    const { username, title } = training
    this.isValidTraining(username, title)
    return training
  }

  private isAccessToken (cookies: MyCookie): void {
    if (cookies?.jwt === null) throw new HttpException(401, 'Unauthorized')
  }

  private isOwnerOfTraining (training: TrainingModel, currentUser: string): void {
    if (training.username !== currentUser) throw new HttpException(403, 'Forbidden, not owner')
  }

  private async isExistingUser (token: string): Promise<UserModel> {
    const currentUser = await this.decodeUserName(token, this.accessSecret)
    if (currentUser == null) throw new HttpException(403, 'Forbidden, user does not exist')
    return currentUser
  }

  private isValidTrainingId (trainingId: string): void {
    if (trainingId == null || trainingId === undefined || trainingId === '') {
      throw new MissingDataException('Invalid training ID')
    }
  }

  private isValidTraining (username: string, title: string): void {
    if (username === '' || username === null || username === undefined) {
      throw new MissingDataException('Username required to create new training instance')
    }
    if (title === '' || title === null || title === undefined) {
      throw new MissingDataException('Title required to create new training instance')
    }
  }

  private async decodeUserName (token: string, secret: string): Promise<UserModel> {
    console.log('DECODE START')
    const decoded = jwt.verify(token, secret) as DecodedToken
    console.log('DECODE FINISH')
    const currentUser = await User.findOne({ username: decoded.username }).exec() as UserModel
    console.log('----------------------------')
    console.log(`currentUser FROM DB: ${JSON.stringify(currentUser)}`)
    return currentUser
  }
}

export default TrainingService

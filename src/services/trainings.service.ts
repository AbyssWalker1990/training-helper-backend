import { Training, type TrainingModel } from '../models/Training'
import MissingDataException from '../exceptions/trainingsExceptions/MissingDataException'
import type Exercise from '../interfaces/trainings/exercise.interface'
import HttpException from '../exceptions/HttpException'
import { User, type UserModel } from '../models/User'

interface MyCookie {
  jwt: string
}

class TrainingService {
  public async createSingleTraining (username: string, title: string, exercises: Exercise[]): Promise<TrainingModel> {
    this.isValidTraining(username, title)
    const newTraining = await Training.create({
      username,
      title,
      exercises
    })
    return newTraining
  }

  public async deleteSingleTraining (cookies: MyCookie, trainingId: string): Promise<void> {
    this.isAccessToken(cookies)
    const accessToken = cookies.jwt
    const currentUser = await this.isExistingUser(accessToken)
    const currentUserName = currentUser.username

    const training = await Training.findById(trainingId) as TrainingModel
    this.isOwnerOfTraining(training, currentUserName)
    await Training.findByIdAndDelete(trainingId)
  }

  private isAccessToken (cookies: MyCookie): void {
    if (cookies?.jwt === null) throw new HttpException(401, 'Unauthorized')
  }

  private isOwnerOfTraining (training: TrainingModel, currentUser: string): void {
    if (training.username !== currentUser) throw new HttpException(403, 'Forbidden')
  }

  private async isExistingUser (token: string): Promise<UserModel> {
    const currentUser = await User.findOne({ refreshToken: token }).exec() as UserModel
    if (currentUser == null) throw new HttpException(403, 'Forbidden')
    return currentUser
  }

  private isValidTraining (username: string, title: string): void {
    if (username === '' || username === null || username === undefined) {
      throw new MissingDataException('Username required to create new training instance')
    }
    if (title === '' || title === null || title === undefined) {
      throw new MissingDataException('Title required to create new training instance')
    }
  }
}

export default TrainingService

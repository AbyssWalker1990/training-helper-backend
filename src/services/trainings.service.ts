import { Training, type TrainingModel } from '../models/Training'
import MissingDataException from '../exceptions/trainingsExceptions/MissingDataException'
import type Exercise from '../interfaces/trainings/exercise.interface'

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

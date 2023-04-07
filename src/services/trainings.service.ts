import { Training, type TrainingModel } from '../models/Training'
import type { Request, Response } from 'express'
import MissingDataException from '../exceptions/trainingsExceptions/MissingDataException'
import type Exercise from '../interfaces/trainings/exercise.interface'

class TrainingService {
  public async createSingleTraining (req: Request, res: Response, username: string, title: string, exercises: Exercise[]): Promise<TrainingModel> {
    if (username === '' || username === null || username === undefined) {
      throw new MissingDataException('Username required to create new training instance')
    }
    if (title === '' || title === null || title === undefined) {
      throw new MissingDataException('Title required to create new training instance')
    }
    const newTraining = await Training.create({
      username,
      title,
      exercises
    })
    console.log(newTraining)
    return newTraining
  }
}

export default TrainingService

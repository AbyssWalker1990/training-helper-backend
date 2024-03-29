import { Training } from '../models/Training'
import type { Exercise, TrainingModel, singleSet } from '../interfaces/training.interface'
import exercisesList from '../config/exercisesList'

class TestService {
  public async createRandomTraining (username: string): Promise<TrainingModel> {
    const title = 'Test training'
    const exercises = this.createExercisesList()
    const createdTraining = await Training.create({
      username,
      title,
      exercises
    })
    return createdTraining
  }

  public deleteAllTestTrainings = async (): Promise<void> => {
    await Training.deleteMany({ title: 'Test training' })
  }

  private readonly createExercisesList = (): Exercise[] => {
    const exercises: Exercise[] = []
    for (let i = 1; i < this.getRandomNumber(4, 10); i++) {
      const sets = this.createSetListForSingleExercise()
      const exercise: Exercise = {
        position: i,
        name: exercisesList[this.getRandomNumber(0, exercisesList.length - 1)],
        sets
      }
      exercises.push(exercise)
    }
    return exercises
  }

  private readonly createSetListForSingleExercise = (): singleSet[] => {
    const sets: singleSet[] = []
    for (let i = 1; i < this.getRandomNumber(4, 10); i++) {
      const singleSet: singleSet = {
        setPos: i,
        reps: this.getRandomNumber(4, 25),
        weight: this.getRandomNumber(10, 250)
      }
      sets.push(singleSet)
    }
    return sets
  }

  private readonly getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private readonly findAllTestTrainings = async (): Promise<TrainingModel[]> => {
    const testTrainingsList = await Training.find({ title: 'Test training' })
    return testTrainingsList
  }
}

export default TestService

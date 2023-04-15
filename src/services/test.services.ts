import { Training } from '../models/Training'
import type { Exercise, TrainingModel } from '../interfaces/training.interface'
import exercisesList from '../config/exercisesList'


class TestService {
  // public async createRandomTraining (username: string): Promise<TrainingModel> {
  //   const title = 'Test training'

  //   for (let i = 1; i < this.getRandomNumber(4, 10); i++) {
  //     const exercise: Exercise = {
  //       position: i,
  //       name: exercisesList[this.getRandomNumber(0, exercisesList.length)],
  //       set: 
  //       {
  //         setPos: i,
  //         reps: this.getRandomNumber(4, 25),
  //         weight: this.getRandomNumber(10, 250)
  //       }
  //     }
  //   }

  //   const createdTraining = await Training.create({
  //     username,
  //     title,
  //     exercises
  //   })
  //   return createdTraining
  // }

  private readonly getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
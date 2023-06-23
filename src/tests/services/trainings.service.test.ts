import { describe, expect, test } from '@jest/globals'
import TrainingService from '../../services/trainings.service'
import { type Exercise } from '../../interfaces/training.interface'
import { Training } from '../../models/Training'
import MissingDataException from '../../exceptions/trainingsExceptions/MissingDataException'

describe('TrainingService', () => {
  const trainingService = new TrainingService()
  const exercises: Exercise[] = [
    {
      position: 1,
      name: 'Arm press',
      sets: [{
        setPos: 1,
        reps: 12,
        weight: 200
      },
      {
        setPos: 2,
        reps: 12,
        weight: 200
      },
      {
        setPos: 3,
        reps: 12,
        weight: 200
      }]
    }
  ]

  describe('createSingleTraining', () => {
    test('Returns training object', async () => {
      const finalTraining = {
        username: 'username',
        title: 'testTraining',
        exercises
      }
      jest.spyOn(Training, 'create').mockReturnValueOnce(finalTraining as any)

      const result = await trainingService.createSingleTraining('username', 'testTraining', exercises)
      expect(result).toEqual(finalTraining)
    })

    test('Throws an error if username is blank', async () => {
      await expect(trainingService.createSingleTraining('', 'testTraining', exercises))
        .rejects.toThrow(new MissingDataException('Username required to create new training instance'))
    })

    test('Throws an error if title is blank', async () => {
      await expect(trainingService.createSingleTraining('username', '', exercises))
        .rejects.toThrow(new MissingDataException('Title required to create new training instance'))
    })
  })
})

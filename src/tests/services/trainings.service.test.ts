import { describe, expect, test } from '@jest/globals'
import TrainingService from '../../services/trainings.service'
import { type Exercise } from '../../interfaces/training.interface'
import { Training } from '../../models/Training'
import MissingDataException from '../../exceptions/trainingsExceptions/MissingDataException'
import type CreateUserDto from '../../controllers/user.dto'
import HttpException from '../../exceptions/HttpException'

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

  describe('deleteSingleTraining', () => {
    const user = {
      username: 'username'
    }
    test('Triggers mongoose delete method if all checking passed', async () => {
      jest.spyOn(trainingService as any, 'decodeUserName').mockResolvedValueOnce(user)
      jest.spyOn(trainingService as any, 'isExistingUser').mockResolvedValueOnce(user)
      jest.spyOn(Training, 'findById').mockResolvedValueOnce('training')
      jest.spyOn(trainingService as any, 'isOwnerOfTraining').mockReturnValueOnce(true)
      jest.spyOn(Training, 'findByIdAndDelete').mockResolvedValueOnce('deleted')
      const mainFn = jest.spyOn(trainingService, 'deleteSingleTraining')
      const result = await trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef')
      expect(mainFn).toBeCalledTimes(1)
      expect(result).toBe('deleted')
    })

    test('Throws an error if it is not owner', async () => {
      jest.spyOn(trainingService as any, 'decodeUserName').mockResolvedValueOnce(user)
      jest.spyOn(trainingService as any, 'isExistingUser').mockResolvedValueOnce(user)
      jest.spyOn(Training, 'findById').mockResolvedValueOnce('training')
      expect.hasAssertions()
      await expect(trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new HttpException(403, 'Forbidden, not owner'))
    })

    test('Throws an error if there isnt this training in database', async () => {
      jest.spyOn(trainingService as any, 'decodeUserName').mockResolvedValueOnce(user)
      jest.spyOn(trainingService as any, 'isExistingUser').mockResolvedValueOnce(user)
      jest.spyOn(Training, 'findById').mockResolvedValueOnce(null)
      expect.hasAssertions()
      await expect(trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new MissingDataException('There is no training with 648ec636047ac5ef71312fef ID'))
    })

    test('Throws an error if there is no jwt in cookies', async () => {
      await expect(trainingService.deleteSingleTraining({ jwt: '' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new HttpException(401, 'Unauthorized'))
    })
  })
})

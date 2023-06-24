import TestService from '../../services/test.services'
import { Training } from '../../models/Training'

describe('TestService', () => {
  const testService = new TestService()
  describe('createSetListForSingleExercise', () => {
    test('Returns array of sets for exercise', () => {
      const result = (testService as any).createSetListForSingleExercise()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('createExercisesList', () => {
    test('Returns list with random proper exercises', () => {
      const result = (testService as any).createExercisesList()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('createRandomTraining', () => {
    test('Returns one proper random training', async () => {
      jest.spyOn(Training as any, 'create').mockResolvedValueOnce('training')
      const result = await testService.createRandomTraining('username')
      expect(result).toBe('training')
    })
  })
})

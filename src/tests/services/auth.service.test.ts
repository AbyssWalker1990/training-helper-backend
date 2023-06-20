import { describe, expect, test } from '@jest/globals'
import AuthService from '../../services/auth.service'
import { Query } from 'mongoose'
import HttpException from '../../exceptions/HttpException'

describe('AuthService', () => {
  const authService = new AuthService()
  describe('isUserExists', () => {
    test('Returns false if can not find user in database', async () => {
      jest.spyOn(Query.prototype, 'exec').mockResolvedValue(null)
      const authServiceProto = Object.getPrototypeOf(authService)
      const user = await authServiceProto.isUserExists('username')
      expect(user).toBe(false)
    })

    test('Throw error if user already exists in database', async () => {
      jest.spyOn(Query.prototype, 'exec').mockResolvedValue('anyValue')
      const authServiceProto = Object.getPrototypeOf(authService)
      await expect(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException(409, 'User already exists!'))
    })
  })
})

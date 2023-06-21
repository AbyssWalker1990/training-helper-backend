import { describe, expect, test } from '@jest/globals'
import AuthService from '../../services/auth.service'
import { Query } from 'mongoose'
import HttpException from '../../exceptions/HttpException'
import type CreateUserDto from '../../controllers/user.dto'
import { User } from '../../models/User'

describe('AuthService', () => {
  const authService = new AuthService()
  describe('isUserExists', () => {
    test('Returns false if can not find user in database', async () => {
      jest.spyOn(Query.prototype, 'exec').mockResolvedValue(null)
      const user = await (AuthService.prototype as any).isUserExists('username')
      console.log('USER from test: ', user)
      expect(user).toBe(false)
    })

    test('Throw error if user already exists in database', async () => {
      jest.spyOn(Query.prototype, 'exec').mockResolvedValue('anyValue')
      const authServiceProto = Object.getPrototypeOf(authService)
      await expect(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException(409, 'User already exists!'))
    })
  })

  describe('register', () => {
    test('Returns username of created user', async () => {
      const userData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(AuthService.prototype as any, 'isUserExists').mockResolvedValue(false)
      jest.spyOn(User, 'create').mockReturnValue(userData as any)
      const result = await authService.register(userData)
      expect(result).toBe('username')
    })

    test('Throws an error when password is blank', async () => {
      const blankPasswordUserData: CreateUserDto = {
        username: 'username',
        password: ''
      }
      await expect(authService.register(blankPasswordUserData)).rejects.toThrow(new HttpException(400, 'Username and password are required'))
    })

    test('Throws an error when username is blank', async () => {
      const blankPasswordUserData: CreateUserDto = {
        username: '',
        password: 'password'
      }
      await expect(authService.register(blankPasswordUserData)).rejects.toThrow(new HttpException(400, 'Username and password are required'))
    })
  })

  describe('login', () => {
    test('Returns an array with accessToken and refreshToken', () => {
      const loginData = {
        username: 'username',
        password: 'password'
      }

    })
  })
})

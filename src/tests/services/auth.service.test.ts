import { describe, expect, test } from '@jest/globals'
import AuthService from '../../services/auth.service'
import { Model } from 'mongoose'
import HttpException from '../../exceptions/HttpException'
import type CreateUserDto from '../../models/user.dto'
import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import type { MyCookie } from '../../interfaces/auth.interface'

describe('AuthService', () => {
  let authService: AuthService
  beforeAll(() => {
    process.env = Object.assign(process.env, { REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET })
  })

  beforeEach(() => {
    authService = new AuthService()
  })

  describe('register', () => {
    test('Returns username of created user', async () => {
      const userData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(authService as any, 'isUserExists').mockResolvedValueOnce(false)
      jest.spyOn(User, 'create').mockReturnValueOnce(userData as any)
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
    test('Returns an array with accessToken and refreshToken if passed proper credentials', async () => {
      const loginData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(authService as any, 'findUserByProperty').mockReturnValue(loginData)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true as any)
      jest.spyOn((authService as any), 'generateTokens').mockResolvedValueOnce(['token', 'token'])
      jest.spyOn(authService as any, 'saveRefreshToken').mockResolvedValue(true)
      const result = await authService.login(loginData)
      expect(result).toEqual(['token', 'token'])
    })

    test('Returns an error if username or password doesnt match', async () => {
      const loginData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(authService as any, 'findUserByProperty').mockReturnValueOnce(loginData)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false as any)
      await expect(authService.login(loginData)).rejects.toThrow(new HttpException(401, 'Unauthorized'))
    })

    test('Returns an error if username is blank', async () => {
      const loginData: CreateUserDto = {
        username: '',
        password: 'password'
      }
      await expect(authService.login(loginData)).rejects.toThrow(new HttpException(400, 'Username and password are required'))
    })

    test('Returns an error if password is blank', async () => {
      const loginData: CreateUserDto = {
        username: 'username',
        password: ''
      }
      await expect(authService.login(loginData)).rejects.toThrow(new HttpException(400, 'Username and password are required'))
    })
  })

  describe('refresh', () => {
    test('Returns access token if user have proper cookies with refreshToken', async () => {
      const user: CreateUserDto = {
        username: 'username',
        password: 'password'
      }

      jest.spyOn(authService as any, 'verifyToken').mockReturnValue(true)
      jest.spyOn((authService as any), 'generateTokens').mockResolvedValueOnce(['token', 'token'])
      jest.spyOn(authService as any, 'findUserByProperty').mockReturnValueOnce(user)
      const result = await authService.refresh('CoRrEcT-ToKen')
      expect(result).toBe('token')
    })

    test('Throws an error when there is no user in database', async () => {
      jest.spyOn(authService as any, 'isRefreshTokenExists').mockResolvedValueOnce(true)
      jest.spyOn(authService as any, 'findUserByProperty').mockResolvedValueOnce(null)
      await expect(authService.refresh('CoRrEcT-ToKen')).rejects.toThrow(new HttpException(403, 'Forbidden'))
    })
  })

  describe('isUserExists', () => {
    test('Returns false if can not find user in database', async () => {
      jest.spyOn(Model, 'findOne').mockResolvedValueOnce(null)
      const user = await (authService as any).isUserExists('username')
      expect(user).toBe(false)
    })

    test('Throws an error if user already exists in database', async () => {
      jest.spyOn(Model, 'findOne').mockResolvedValueOnce('anyValue')
      const authServiceProto = Object.getPrototypeOf(authService)
      await expect(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException(409, 'User already exists!'))
    })
  })
})

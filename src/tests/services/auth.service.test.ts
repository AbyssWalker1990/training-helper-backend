import { describe, expect, test } from '@jest/globals'
import AuthService from '../../services/auth.service'
import { Query } from 'mongoose'
import HttpException from '../../exceptions/HttpException'
import type CreateUserDto from '../../controllers/user.dto'
import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import type { MyCookie } from '../../interfaces/auth.interface'

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
      jest.spyOn(Query.prototype, 'exec').mockResolvedValueOnce('anyValue')
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
    test('Returns an array with accessToken and refreshToken', async () => {
      const loginData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(AuthService.prototype as any, 'findUserByProperty').mockReturnValue(loginData)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true as any)
      jest.spyOn((AuthService.prototype as any), 'generateTokens').mockResolvedValueOnce(['token', 'token'])
      jest.spyOn(AuthService.prototype as any, 'saveRefreshToken').mockResolvedValue(true)
      const result = await authService.login(loginData)
      expect(result).toEqual(['token', 'token'])
    })

    test('Returns an error if username or password doesnt match', async () => {
      const loginData: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      jest.spyOn(AuthService.prototype as any, 'findUserByProperty').mockReturnValue(loginData)
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false as any)
      await expect(authService.login(loginData)).rejects.toThrow(new HttpException(401, 'Unauthorized'))
    })
  })

  describe('refresh', () => {
    test('Returns access token if user have proper cookies with refreshToken', async () => {
      const user: CreateUserDto = {
        username: 'username',
        password: 'password'
      }
      const cookie: MyCookie = {
        jwt: 'CoRrEcT-ToKeN'
      }

      jest.spyOn(AuthService.prototype as any, 'verifyToken').mockReturnValue(true)
      jest.spyOn((AuthService.prototype as any), 'generateTokens').mockResolvedValueOnce(['token', 'token'])

      jest.spyOn(AuthService.prototype as any, 'findUserByProperty').mockReturnValue(user)

      const result = await authService.refresh(cookie)
      console.log('result: ', result)
      expect(result).toBe('token')
    })
  })
})

import dotenv from 'dotenv'
import supertest from 'supertest'
import mongoose from 'mongoose'
import App from '../../app'
import AuthController from '../../controllers/AuthController'
import AuthService from '../../services/auth.service'
import { connectDatabase } from '../../config/connectDatabase'
import { User } from '../../models/User'
dotenv.config()
mongoose.set('strictQuery', false)

const PORT = 3501
const app = new App([
  new AuthController()
], PORT)

app.listen()

const testUserData = {
  username: 'testuser',
  password: 'testpassword'
}

describe('auth', () => {
  beforeAll(async () => {
    connectDatabase()

    mongoose.connection.once('open', () => {
      console.log('Successfully connected to database!')
    })
    const authService = new AuthService()
    await authService.register(testUserData)
  })
  afterAll(async () => {
    await User.deleteOne({ username: 'testuser' })
    await User.deleteOne({ username: 'validusername' })
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // LOGIN
  describe('login route', () => {
    describe('given not full credentials', () => {
      it('should return a 400', async () => {
        const invalidUserData = { username: 'invaliduser' }
        const { statusCode, body } = await supertest(app.getServer()).post('/auth/login/').send(invalidUserData)
        expect(statusCode).toBe(400)
        expect(body).toEqual({
          message: 'Username and password are required',
          status: 400
        })
      })
    })
    describe('given wrong credentials', () => {
      it('should return 401', async () => {
        const invalidUserData = { username: 'invaliduser', password: 'invalidpass' }
        const { statusCode, body } = await supertest(app.getServer()).post('/auth/login/').send(invalidUserData)
        expect(statusCode).toBe(401)
        expect(body).toEqual({
          status: 401,
          message: 'Unauthorized'
        })
      })
    })

    describe('given correct credentials', () => {
      it('should return 200', async () => {
        const { statusCode, body } = await supertest(app.getServer()).post('/auth/login/').send(testUserData)
        expect(statusCode).toBe(200)
        expect(body).toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          username: 'testuser'
        })
      })
    })
  })

  // REGISTER
  describe('register route', () => {
    describe('given not full credentials, no password', () => {
      it('should return a 400', async () => {
        const invalidUserData = { username: 'invaliduser' }
        const { statusCode, body } = await supertest(app.getServer()).post('/auth/register/').send(invalidUserData)
        expect(statusCode).toBe(400)
        expect(body).toEqual({
          message: 'password must be a string,password must be longer than or equal to 4 characters',
          status: 400
        })
      })
    })
  })

  describe('login equals to already existing user', () => {
    it('should return 409', async () => {
      const { statusCode, body } = await supertest(app.getServer()).post('/auth/register/').send(testUserData)
      expect(statusCode).toBe(409)
      expect(body).toEqual({
        status: 409,
        message: 'User already exists!'
      })
    })
  })

  describe('given valid credentials', () => {
    it('should return 200', async () => {
      const validRegisterData = {
        username: 'validusername',
        password: 'validpassword'
      }
      const { statusCode, body } = await supertest(app.getServer()).post('/auth/register/').send(validRegisterData)
      expect(statusCode).toBe(201)
      expect(body).toEqual({
        success: 'New user validusername created!'
      })
    })
  })
})

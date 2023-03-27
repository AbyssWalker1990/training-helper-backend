import dotenv from 'dotenv'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import App from '../app'
import AuthController from '../controllers/AuthController'
import SwaggerController from '../controllers/SwaggerController'
dotenv.config()

const PORT = Number(process.env.PORT) ?? 3500
const app = new App([
  new AuthController(),
  new SwaggerController()
], PORT)

app.listen()

describe('auth', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('login route', () => {
    describe('given not full credentials', () => {
      it('should return a 400', async () => {
        const userData = { user: 'invaliduser' }
        await supertest(app.getServer()).post('/auth/login/').send(userData).expect(400)
      })
    })
    describe('given wrong credentials', () => {
      it('should return 401', async () => {
        const userData = { user: 'invaliduser', password: 'invalidpass' }
        await supertest(app.getServer()).post('/auth/login/').send(userData).expect(401)
      })
    })
  })
})

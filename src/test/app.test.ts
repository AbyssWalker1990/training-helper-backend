import app from '../server'
import request from 'supertest'
import { User } from '../models/User'

describe('POST /register', () => {
  it('registers a new user and returns an accessToken', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        user: 'testuser',
        password: 'testpassword'
      })
      .expect(201)
      .expect('Content-Type', /json/)

    expect(typeof response.body.success).toBe('string')
  })
})

describe('POST /auth', () => {
  it('Returns access token if username and password are correct', async () => {
    const response = await request(app)
      .post('/auth')
      .send({
        user: 'testuser',
        password: 'testpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)

    expect(typeof response.body.accessToken).toBe('string')
  })
})

afterAll(async () => {
  // remove test user
  const testUser = await User.findOne({ username: 'testuser' })
  await testUser?.remove()
  console.log('Test user REMOVED')
})

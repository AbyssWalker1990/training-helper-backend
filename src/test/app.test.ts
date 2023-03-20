import app from '../server'
import request from 'supertest'
import { User } from '../models/User'
import { closeDatabase } from '../config/connectDatabase'

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

describe('GET /refresh', () => {
  it('Refreshing Access token', async () => {
    const auth = await request(app)
      .post('/auth')
      .send({
        user: 'testuser',
        password: 'testpassword'
      })
    const cookie = auth.headers['set-cookie'][0]
    const token = cookie.split(';')[0].split('=')[1] as string

    const response = await request(app)
      .get('/refresh')
      .set('Cookie', `jwt=${token}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(typeof response.body.accessToken).toBe('string')
  })
})

describe('GET /logout', () => {
  it('Logout user', async () => {
    await request(app)
      .get('/logout')
      .expect(204)
  })
})

afterAll(async () => {
  // remove test user
  const testUser = await User.findOne({ username: 'testuser' })
  await testUser?.remove()
  console.log('Test user REMOVED')
  closeDatabase()
    .catch((err) => {
      console.log(err)
    })
})

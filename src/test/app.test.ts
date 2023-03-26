// import app from '../server'
// import request from 'supertest'
// import { User } from '../models/User'
// import { closeDatabase } from '../config/connectDatabase'

// describe('POST /auth/register', () => {
//   it('registers a new user and returns an accessToken', async () => {
//     const response = await request()
//       .post('/auth/register')
//       .send({
//         user: 'testuser',
//         password: 'testpassword'
//       })
//       .expect(201)
//       .expect('Content-Type', /json/)

//     expect(typeof response.body.success).toBe('string')
//   })
// })

// describe('POST /auth/login', () => {
//   it('Returns access token if username and password are correct', async () => {
//     const response = await request(app)
//       .post('/auth/login')
//       .send({
//         user: 'testuser',
//         password: 'testpassword'
//       })
//       .expect(200)
//       .expect('Content-Type', /json/)

//     expect(typeof response.body.accessToken).toBe('string')
//   })
// })

// describe('GET /auth/refresh', () => {
//   it('Refreshing Access token', async () => {
//     const auth = await request(app)
//       .post('/auth/login')
//       .send({
//         user: 'testuser',
//         password: 'testpassword'
//       })
//     const cookie = auth.headers['set-cookie'][0]
//     const token = cookie.split(';')[0].split('=')[1] as string

//     const response = await request(app)
//       .get('/auth/refresh')
//       .set('Cookie', `jwt=${token}`)
//       .expect(200)
//       .expect('Content-Type', /json/)

//     expect(typeof response.body.accessToken).toBe('string')
//   })
// })

// describe('GET /auth/logout', () => {
//   it('Logout user', async () => {
//     await request(app)
//       .get('/auth/logout')
//       .expect(204)
//   })
// })

// afterAll(async () => {
//   // remove test user
//   const testUser = await User.findOne({ username: 'testuser' })
//   await testUser?.remove()
//   console.log('Test user REMOVED')
//   await closeDatabase()
// })

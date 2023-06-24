import App from '../app'
import AuthController from '../controllers/AuthController'
import TrainingController from '../controllers/TrainingController'
import TestController from '../controllers/TestController'
import SwaggerController from '../controllers/SwaggerController'

describe('App', () => {
  const app = new App([
    new AuthController(),
    new TrainingController(),
    new TestController(),
    new SwaggerController()
  ], 3501)
  test('getServer', () => {
    const server = app.getServer()
    expect(server).not.toBe(null)
    expect(server).not.toBe(undefined)
  })
})

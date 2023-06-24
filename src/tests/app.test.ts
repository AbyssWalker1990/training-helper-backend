import App from '../app'
import AuthController from '../controllers/AuthController'

describe('App', () => {
  const app = new App([new AuthController()], 3501)
  test('getServer', () => {
    const server = app.getServer()
    expect(server).not.toBe(null)
    expect(server).not.toBe(undefined)
  })
})

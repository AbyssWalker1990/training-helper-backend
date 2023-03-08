import express from 'express'
const refreshRouter = express.Router()
import refreshTokenController from '../../controllers/authControllers/refreshTokenController'

refreshRouter.get('/', refreshTokenController)

export default refreshRouter
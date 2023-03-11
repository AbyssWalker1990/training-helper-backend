import express from 'express'
const refreshRouter = express.Router()
import { handleRefreshToken } from '../../controllers/authControllers/refreshTokenController'

refreshRouter.get('/', handleRefreshToken)

export default refreshRouter
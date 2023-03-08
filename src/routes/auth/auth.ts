import express from 'express'
const authRouter = express.Router()
import handleLogin from '../../controllers/authControllers/authController'

authRouter.post('/', handleLogin)

export default authRouter
import express from 'express'
const registerRouter = express.Router()
import { registerUser } from '../../controllers/authControllers/registerController'

registerRouter.post('/', registerUser)

export default registerRouter
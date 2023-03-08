import express from 'express'
const router = express.Router()
import { registerUser } from '../../controllers/authControllers/registerController'

router.post('/', registerUser)

export default router
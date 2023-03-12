import express from 'express'
import { handleLogin } from '../../controllers/authControllers/authController'
const authRouter = express.Router()

authRouter.post('/', (req, res) => {
  handleLogin(req, res)
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
})

export default authRouter

import express from 'express'
import { registerUser } from '../../controllers/authControllers/registerController'
const registerRouter = express.Router()

registerRouter.post('/', (req, res) => {
  registerUser(req, res)
    .then(() => {
    })
    .catch((err) => {
      console.log(err)
    })
})

export default registerRouter

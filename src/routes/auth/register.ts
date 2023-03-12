import express from 'express'
import { registerUser } from '../../controllers/authControllers/registerController'
const router = express.Router()

router.post('/', (req, res) => {
  registerUser(req, res)
    .then(() => {
      console.log('success')
    })
    .catch((err) => {
      console.log(err)
    })
})

export default router

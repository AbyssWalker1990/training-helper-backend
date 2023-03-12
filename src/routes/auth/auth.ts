import express from 'express'
import { handleLogin } from '../../controllers/authControllers/authController'
const router = express.Router()

router.post('/', (req, res) => {
  handleLogin(req, res)
    .then(() => {
      console.log('success')
    })
    .catch((err) => {
      console.log(err)
    })
})

export default router

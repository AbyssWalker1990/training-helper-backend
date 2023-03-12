import express from 'express'
import { handleLogout } from '../../controllers/authControllers/logoutController'
const logoutRouter = express.Router()

logoutRouter.get('/', (req, res) => {
  handleLogout(req, res)
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
})

export default logoutRouter

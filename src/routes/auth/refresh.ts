import express from 'express'
import { handleRefreshToken } from '../../controllers/authControllers/refreshTokenController'
const refreshRouter = express.Router()

refreshRouter.get('/', (req, res) => {
  handleRefreshToken(req, res)
    .then(() => {
      console.log('success')
    })
    .catch((err) => {
      console.log(err)
    })
})

export default refreshRouter

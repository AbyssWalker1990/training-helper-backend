import express from 'express'
const logoutRouter = express.Router()
import handleLogout from '../../controllers/authControllers/logoutController'

logoutRouter.get('/', handleLogout)

export default logoutRouter
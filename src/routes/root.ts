import express from 'express'
import path from 'path'
const rootRouter = express.Router()
// const verifyToken = require('../middleware/verifyToken')

rootRouter.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'))
})
// router.route('^/$|/index(.html)?')
//   .get(verifyToken, (req, res) => {
//          res.send('Hi')
//       })

export default rootRouter

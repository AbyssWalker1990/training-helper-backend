import express, { Request, Response } from 'express'
const rootRouter = express.Router()
import path from 'path'
// const verifyToken = require('../middleware/verifyToken')

rootRouter.get('^/$|/index(.html)?', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'))
})
// router.route('^/$|/index(.html)?')
//   .get(verifyToken, (req, res) => {
//          res.send('Hi')
//       })
  

export default rootRouter


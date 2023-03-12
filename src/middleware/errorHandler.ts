import { logEvents } from './logEvents'
import { type ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  logEvents(`${err.name as string}: ${err.message as string}`, 'errorLog.txt')
    .then(() => {
      console.log(err.stack)
      res.status(500).send(err.message)
    })
    .catch((error) => {
      console.log(error)
      next(error)
    })
}

export default errorHandler

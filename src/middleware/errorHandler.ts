import { logEvents } from './logEvents'
import {ErrorRequestHandler} from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errorLog.txt')
  console.log(err.stack)
  res.status(500).send(err.message)
}

export default errorHandler

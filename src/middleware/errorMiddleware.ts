import { type Request, type Response, type NextFunction } from 'express'
import type HttpException from '../exceptions/HttpException'
import { logEvents } from './logEvents'

function errorMiddleware (err: HttpException, req: Request, res: Response, next: NextFunction): void {
  const status = err.status
  const message = err.message
  logEvents(message, 'errorLog.log')
    .catch((err) => { console.log(err) })

  res.status(status).json({ status, message })
}

export default errorMiddleware

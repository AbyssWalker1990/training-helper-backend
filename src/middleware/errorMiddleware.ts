import { type Request, type Response, type NextFunction } from 'express'
import type HttpException from '../exceptions/HttpException'
import { logEvents } from './logEvents'

function errorMiddleware (err: HttpException, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
  const status = err.status
  const message = err.message
  console.log('Error middleware working')
  console.log(status)
  console.log(message)
  logEvents(message, 'errorLog.log')
    .catch((err) => { console.log(err) })

  return res.status(status).json({ status, message })
}

export default errorMiddleware

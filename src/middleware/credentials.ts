import allowedHosts from '../config/allowedHosts'
import { type RequestHandler } from 'express'

const credentials: RequestHandler = (req, res, next): void => {
  const origin = req.header('Origin')
  if (allowedHosts.includes(origin as string)) {
    res.set('Access-Control-Allow-Credentials', 'true')
  }
  next()
}

export default credentials

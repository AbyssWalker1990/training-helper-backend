import allowedHosts from '../config/allowedHosts'
import { Request, Response, NextFunction } from 'express'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.header('Origin')
  if (allowedHosts.includes(origin as string)) {
    res.set('Access-Control-Allow-Credentials', 'true')
  }
  next()
}

export default credentials
import allowedHosts from '../config/allowedHosts'
import { Request, Response, NextFunction } from 'express'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin
  if (origin != null) {
    if (allowedHosts.includes(origin)) {
      // res.headers('Access-Control-Allow-Credentials', true)
      console.log('OK')
    }
  }
  next()
}

export default credentials
import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Need to test and maybe rewrite in future when this func will be needed

interface MyRequest extends Request {
  name: string
}

// Needed for future routes only for authorized users
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as string

  const authHeader = req.headers.authorization ?? req.headers.Authorization as string
  if (!authHeader?.startsWith('Bearer ')) res.sendStatus(401)
  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, accessSecret) as string
  console.log('Decoded: ' + decoded)
  // if (decoded === req.name) { // Need to add logic for comparing with database user
  //   next()
  // }
  next()
}

export default verifyToken

// OLD VESION
// jwt.verify(
//   token,
//   accessSecret,
//   (err, decoded) => {
//     if (err) return res.sendStatus(403)
//     req.user = decoded.username
//     next()
//   }
// )

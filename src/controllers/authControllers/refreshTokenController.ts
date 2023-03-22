import { type Request, type Response } from 'express'
import { User, type UserModel } from '../../models/User'
import jwt from 'jsonwebtoken'

interface DecodedToken {
  username: string
}

interface MyCookie {
  jwt: string
}

interface CustomRequest extends Request {
  cookies: MyCookie
}

export const handleRefreshToken = async (req: CustomRequest, res: Response): Promise<any> => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
  const cookies = req.cookies
  if (cookies?.jwt === null) return res.sendStatus(401) // Unauthorized
  const refreshToken = cookies.jwt
  console.log(`Refresh token cookie: ${refreshToken}`)
  const currentUser = await User.findOne({ refreshToken }).exec() as UserModel
  if (currentUser != null) {
    console.log(`User refresh token: ${currentUser.refreshToken}`)
    console.log(`Name: ${currentUser.username}`)
  }

  if (currentUser == null) return res.sendStatus(403) // Forbidden
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as DecodedToken
    if (currentUser.username !== decoded.username) return res.sendStatus(403)
    const accessToken = jwt.sign(
      { username: currentUser.username },
      accessSecret,
      { expiresIn: '20m' }
    )
    res.status(200).json({ accessToken })
  } catch (error) {
    return res.sendStatus(403)
  }
}

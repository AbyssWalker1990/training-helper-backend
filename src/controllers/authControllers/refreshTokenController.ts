import { Request, Response } from "express"
import User from '../../models/User'
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken';

interface DecodedToken {
  username: string
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401) // Unauthorized
  const refreshToken = cookies.jwt as string
  console.log(`Refresh token cookie: ${refreshToken}`)
  const currentUser = await User.findOne({ refreshToken }).exec()
  if (currentUser != null) {
    console.log(`User refresh token: ${currentUser.refreshToken}`)
    console.log(`Name: ${currentUser.username}`)
  }

  if (!currentUser) return res.sendStatus(403) // Forbidden
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as DecodedToken;
    if (currentUser.username !== decoded.username) return res.sendStatus(403)
    const accessToken = jwt.sign(
      { "username": currentUser.username },
      accessSecret,
      { expiresIn: '20m' }
    )
    res.json({ accessToken })
  } catch (error) {
    return res.sendStatus(403)
  }
}


export default handleRefreshToken
import { User } from '../../models/User'
import { type Request, type Response } from 'express'

interface Cookie {
  jwt: string
}

// Can't delete access token from there, DONT FORGET WHEN STARTING build frontend
export const handleLogout = async (req: Request, res: Response): Promise<any> => {
  const cookies: Cookie = req.cookies
  if (cookies?.jwt === null) return res.sendStatus(204) // No content
  const refreshToken = cookies.jwt

  // Check database for refresh token
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (foundUser == null) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204) // No content
  }

  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log(result)

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  })
  res.sendStatus(204)
}

import type { Request, Response } from 'express'
import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export const handleLogin = async (req: Request, res: Response): Promise<any> => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
  const { user, password }: { user: string, password: string } = req.body
  if (user === '' || password === '') return res.status(400).json({ message: 'Username and password are required' })
  const currentUser = await User.findOne({ username: user }).exec()
  if (currentUser == null) return res.sendStatus(401)
  // Compare password
  const match = await bcrypt.compare(password, currentUser.password)
  const payload: JwtPayload = {
    username: currentUser.username
  }
  if (match !== null) {
    const accessToken = jwt.sign(
      payload,
      accessSecret,
      { expiresIn: '20m' }
    )
    const refreshToken = jwt.sign(
      payload,
      refreshSecret,
      { expiresIn: '1d' }
    )
    // Saving refreshToken to current user
    currentUser.refreshToken = refreshToken
    const result = await currentUser.save()
    console.log(result)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
}

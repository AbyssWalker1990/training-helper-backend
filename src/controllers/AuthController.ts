import type { Request, Response, NextFunction } from 'express'
import { User, type UserModel } from '../models/User'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import express from 'express'
import type Controller from '../interfaces/controller.interface'
import HttpException from '../exceptions/HttpException'
import { nextDay } from 'date-fns'

interface DecodedToken {
  username: string
}

interface MyCookie {
  jwt: string
}

interface CustomRequest extends Request {
  cookies: MyCookie
}

class AuthController implements Controller {
  public path = '/auth'
  public router = express.Router()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.post(`${this.path}/login`, this.handleLogin)
    this.router.post(`${this.path}/register`, this.registerUser)
    this.router.get(`${this.path}/refresh`, this.handleRefreshToken)
    this.router.get(`${this.path}/logout`, this.handleLogout)
  }

  private readonly handleLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
    const { user, password }: { user: string, password: string } = req.body
    if (user === '' || password === '' || user === undefined || password === undefined) {
      // return res.status(400).json({ message: 'Username and password are required' })
      next(new HttpException(400, 'Username and password are required'))
      return
    }
    const currentUser = await User.findOne({ username: user }).exec()
    if (currentUser == null) {
      next(new HttpException(401, 'Unauthorized'))
      return
    }
    // Compare password
    const match = await bcrypt.compare(password, currentUser.password)
    console.log('Match: ', match)
    const payload: JwtPayload = {
      username: currentUser.username
    }
    if (match !== null && match) {
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
      res.status(200).json({ accessToken })
    } else {
      next(new HttpException(401, 'Unauthorized'))
    }
  }

  private readonly registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user, password }: { user: string, password: string } = req.body
    if (user === '' || password === '' || user === undefined || password === undefined) {
      next(new HttpException(400, 'Username and password are required'))
      return
    }
    // Check if user alreasy exists
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate != null) {
      next(new HttpException(409, 'User already exists!'))
    }

    try {
      const HashedPassword = await bcrypt.hash(password, 10)
      const result = await User.create({
        username: user,
        password: HashedPassword
      })
      console.log(result)
      res.status(201).json({ success: `New User ${user} created!!!` })
    } catch (error) {
      next(new HttpException(500, (error as Error).message))
    }
  }

  private readonly handleRefreshToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    const cookies = req.cookies
    if (cookies.jwt === null || cookies.jwt === undefined) {
      console.log('NO COOKIES')
      next(new HttpException(401, 'Unauthorized'))
      return
    }

    const refreshToken = cookies.jwt
    console.log(`Refresh token cookie: ${refreshToken}`)
    if (refreshToken === undefined) {
      console.log('REFRESH TOKEN UNDEFINED')
      next(new HttpException(401, 'Unauthorized'))
      return
    }
    const currentUser = await User.findOne({ refreshToken }).exec() as UserModel
    if (currentUser != null) {
      console.log(`User refresh token: ${currentUser.refreshToken}`)
      console.log(`Name: ${currentUser.username}`)
    }

    if (currentUser == null) {
      next(new HttpException(403, 'Forbidden'))
      return
    }
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret) as DecodedToken
      if (currentUser.username !== decoded.username) {
        next(new HttpException(403, 'Forbidden'))
        return
      }
      const accessToken = jwt.sign(
        { username: currentUser.username },
        accessSecret,
        { expiresIn: '20m' }
      )
      res.status(200).json({ accessToken })
    } catch (error) {
      next(new HttpException(403, 'Forbidden'))
    }
  }

  // Can't delete access token from there, DONT FORGET WHEN STARTING build frontend
  private readonly handleLogout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const cookies: MyCookie = req.cookies
    console.log('COOKIES JWT: ', cookies.jwt)
    if (cookies.jwt === null) {
      next(new HttpException(204, 'No content'))
      return
    }
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
}

export default AuthController

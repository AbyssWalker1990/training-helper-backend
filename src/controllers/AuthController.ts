import type { Request, Response, NextFunction } from 'express'
import { User, type UserModel } from '../models/User'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import express from 'express'
import type Controller from '../interfaces/controller.interface'
import HttpException from '../exceptions/HttpException'
import validationMiddleware from '../middleware/validationMiddleware'
import CreateUserDto from './user.dto'
import AuthService from '../services/auth.service'

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
  public authService = new AuthService()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.post(`${this.path}/login`, this.handleLogin)
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registerUser)
    this.router.get(`${this.path}/refresh`, this.handleRefreshToken)
    this.router.get(`${this.path}/logout`, this.handleLogout)
  }

  private readonly handleLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userData = req.body
    const [accessToken, refreshToken] = await this.authService.login(userData)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({ accessToken })
  }

  private readonly registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData = req.body as CreateUserDto
    try {
      const user = await this.authService.register(userData)
      res.status(201).json({ success: `New user ${user} created!` })
    } catch (error) {
      console.log(error)
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
  private readonly handleLogout = async (req: Request, res: Response): Promise<any> => {
    const cookies: MyCookie = req.cookies
    if (cookies.jwt === null) return res.sendStatus(204) // No content
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

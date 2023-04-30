import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import express from 'express'
import type Controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validationMiddleware'
import CreateUserDto from './user.dto'
import AuthService from '../services/auth.service'

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
    const username = userData.username
    try {
      const [accessToken, refreshToken] = await this.authService.login(userData)
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.status(200).json({ username, accessToken })
    } catch (error) {
      next(error)
    }
  }

  private readonly registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData = req.body as CreateUserDto
    try {
      const user = await this.authService.register(userData)
      res.status(201).json({ success: `New user ${user} created!` })
    } catch (error) {
      next(error)
    }
  }

  private readonly handleRefreshToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const cookies = req.cookies
    try {
      const accessToken = await this.authService.refresh(cookies)
      res.status(200).json({ accessToken })
    } catch (error) {
      next(error)
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

import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import { type Request, type Response } from 'express'
import express from 'express'
import type Controller from '../../interfaces/controller.interface'

class RegisterController implements Controller {
  public path = '/register'
  public router = express.Router()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.post(this.path, this.registerUser)
  }

  private readonly registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Try to register')

    const { user, password }: { user: string, password: string } = req.body
    if (user === '' || password === '' || user === undefined || password === undefined) {
      res.status(400).json({ message: 'Username and password are required' })
    }
    console.log(`User: ${user}\tPassword: ${password}`)
    // Check if user alreasy exists
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate != null) res.sendStatus(409)

    try {
      const HashedPassword = await bcrypt.hash(password, 10)
      const result = await User.create({
        username: user,
        password: HashedPassword
      })
      console.log(result)
      res.status(201).json({ success: `New User ${user} created!!!` })
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
}

export default RegisterController

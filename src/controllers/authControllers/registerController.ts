import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import { type Request, type Response } from 'express'

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { user, password }: { user: string, password: string } = req.body
  if (user === '' || password === '' || user === undefined || password === undefined) {
    return res.status(400).json({ message: 'Username and password are required' })
  }
  console.log(`User: ${user}\tPassword: ${password}`)
  // Check if user alreasy exists
  const duplicate = await User.findOne({ username: user }).exec()
  if (duplicate != null) return res.sendStatus(409)

  try {
    const HashedPassword = await bcrypt.hash(password, 10)
    const result = User.create({
      username: user,
      password: HashedPassword
    })
    console.log(result)
    res.status(201).json({ success: `New User ${user} created!!!` })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

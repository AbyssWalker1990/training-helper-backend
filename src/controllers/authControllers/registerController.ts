import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import { Request, Response } from "express"

export const registerUser = async (req: Request, res: Response) => {
  const { user, password } = req.body
  if (!user || !password) return res.status(400).json({ message: "Username and password are required" })
  // Check if user alreasy exists
  const duplicate = await User.findOne({ username: user }).exec()
  if (duplicate) return res.sendStatus(409)

  try {
    const HashedPassword = await bcrypt.hash(password, 10)
    const result = User.create({
      'username': user,
      'password': HashedPassword
    })
    console.log(result)
    res.status(201).json({ success: `New User ${user} created!!!` })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

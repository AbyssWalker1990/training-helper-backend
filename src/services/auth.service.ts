import { User } from '../models/User'
import type CreateUserDto from '../controllers/user.dto'
import HttpException from '../exceptions/HttpException'
import bcrypt from 'bcrypt'

class AuthService {
  public async register (userData: CreateUserDto): Promise<string> {
    const { user, password }: { user: string, password: string } = userData
    if (user === '' || password === '' || user === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
    // Check if user alreasy exists
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate != null) {
      throw new HttpException(409, 'User already exists!')
    }

    try {
      const HashedPassword = await bcrypt.hash(password, 10)
      const result = await User.create({
        username: user,
        password: HashedPassword
      })
      console.log(result)
      return result.username
    } catch (error) {
      throw new HttpException(500, (error as Error).message)
    }
  }
}

export default AuthService

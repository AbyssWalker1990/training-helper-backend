import { User } from '../models/User'
import type CreateUserDto from '../controllers/user.dto'
import HttpException from '../exceptions/HttpException'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

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

  public async login (userData: CreateUserDto): Promise<string[]> {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
    const { user, password }: { user: string, password: string } = userData
    if (user === '' || password === '' || user === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
    const currentUser = await User.findOne({ username: user }).exec()
    if (currentUser == null) {
      throw new HttpException(401, 'Unauthorized')
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
      return [accessToken, refreshToken]
    } else {
      throw new HttpException(401, 'Unauthorized')
    }
  }
}

export default AuthService

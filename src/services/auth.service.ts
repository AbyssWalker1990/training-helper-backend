import { User } from '../models/User'
import type { UserModel, DecodedToken, MyCookie } from '../interfaces/auth.interface'
import type CreateUserDto from '../controllers/user.dto'
import HttpException from '../exceptions/HttpException'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

class AuthService {
  public async register (userData: CreateUserDto): Promise<string> {
    const { username, password }: { username: string, password: string } = userData
    if (username === '' || password === '' || username === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
    // Check if user alreasy exists
    const duplicate = await User.findOne({ username }).exec()
    if (duplicate != null) {
      throw new HttpException(409, 'User already exists!')
    }

    try {
      const HashedPassword = await bcrypt.hash(password, 10)
      const result = await User.create({
        username,
        password: HashedPassword
      })
      return result.username
    } catch (error) {
      throw new HttpException(500, (error as Error).message)
    }
  }

  public async login (userData: CreateUserDto): Promise<string[]> {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
    const { username, password }: { username: string, password: string } = userData
    if (username === '' || password === '' || username === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
    const currentUser = await User.findOne({ username }).exec()
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

  public async refresh (cookies: MyCookie): Promise<string> {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    const jwtCookie = cookies
    if (jwtCookie.jwt === null || jwtCookie.jwt === undefined) {
      console.log('NO COOKIES')
      throw new HttpException(401, 'Unauthorized')
    }

    const refreshToken = jwtCookie.jwt
    console.log(`Refresh token cookie: ${refreshToken}`)
    if (refreshToken === undefined) {
      console.log('REFRESH TOKEN UNDEFINED')
      throw new HttpException(401, 'Unauthorized')
    }
    const currentUser = await User.findOne({ refreshToken }).exec() as UserModel
    if (currentUser != null) {
      console.log(`User refresh token: ${currentUser.refreshToken}`)
      console.log(`Name: ${currentUser.username}`)
    }

    if (currentUser == null) {
      throw new HttpException(403, 'Forbidden')
    }
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret) as DecodedToken
      if (currentUser.username !== decoded.username) {
        throw new HttpException(403, 'Forbidden')
      }
      const accessToken = jwt.sign(
        { username: currentUser.username },
        accessSecret,
        { expiresIn: '20m' }
      )
      return accessToken
    } catch (error) {
      throw new HttpException(403, 'Forbidden')
    }
  }
}

export default AuthService

import { User } from '../models/User'
import type { UserModel, DecodedToken, MyCookie } from '../interfaces/auth.interface'
import type CreateUserDto from '../controllers/user.dto'
import HttpException from '../exceptions/HttpException'
import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Types, Document } from 'mongoose'

class AuthService {
  accessSecret: string
  refreshSecret: string
  constructor () {
    this.accessSecret = process.env.ACCESS_TOKEN_SECRET as string
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET as string
  }

  public async register (userData: CreateUserDto): Promise<string> {
    const { username, password }: { username: string, password: string } = userData
    this.isDataFull(username, password)
    let createdUser

    try {
      await this.isUserExists(username)
      const HashedPassword = await bcrypt.hash(password, 10)
      console.log('HashedPassword: ', HashedPassword)
      createdUser = await User.create({
        username,
        password: HashedPassword
      })
    } catch (error) {
      throw new HttpException(500, (error as Error).message)
    }
    return createdUser.username
  }

  public async login (userData: CreateUserDto): Promise<string[]> {
    const { username, password }: { username: string, password: string } = userData
    this.isDataFull(username, password)
    const currentUser = await this.findUserByUsername(username)
    const match = await bcrypt.compare(password, currentUser.password)
    console.log('Match: ', match)
    if (match === null || !match) throw new HttpException(401, 'Unauthorized')
    const [accessToken, refreshToken] = await this.generateTokens(username)
    await this.saveRefreshToken(currentUser, refreshToken)
    return [accessToken, refreshToken]
  }

  public async refresh (cookies: MyCookie): Promise<string> {
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
      const decoded = jwt.verify(refreshToken, this.refreshSecret) as DecodedToken
      if (currentUser.username !== decoded.username) {
        throw new HttpException(403, 'Forbidden')
      }
      const accessToken = jwt.sign(
        { username: currentUser.username },
        this.accessSecret,
        { expiresIn: '20m' }
      )
      return accessToken
    } catch (error) {
      throw new HttpException(403, 'Forbidden')
    }
  }

  private async isUserExists (username: string): Promise<boolean> {
    const duplicate = await User.findOne({ username })
    if (duplicate != null) {
      throw new HttpException(409, 'User already exists!')
    }
    return false
  }

  private async findUserByUsername (username: string): Promise<Document<unknown, any, UserModel> & Omit<UserModel & {
    _id: Types.ObjectId
  }, never>> {
    const user = await User.findOne({ username }).exec()
    console.table(user)
    if (user == null) {
      throw new HttpException(401, 'Unauthorized')
    }
    return user
  }

  private isDataFull (username: string, password: string): void {
    if (username === '' || password === '' || username === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
  }

  private async generateTokens (username: string): Promise<[string, string]> {
    const payload: JwtPayload = {
      username
    }
    const accessToken = jwt.sign(
      payload,
      this.accessSecret,
      { expiresIn: '20m' }
    )
    const refreshToken = jwt.sign(
      payload,
      this.refreshSecret,
      { expiresIn: '1d' }
    )
    return [accessToken, refreshToken]
  }

  private async saveRefreshToken (userData: Document<unknown, any, UserModel> & Omit<UserModel & {
    _id: Types.ObjectId
  }, never>, refreshToken: string): Promise<void> {
    userData.refreshToken = refreshToken
    await userData.save()
  }
}

export default AuthService

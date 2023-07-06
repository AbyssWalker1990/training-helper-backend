import { User } from '../models/User'
import type { UserModel, DecodedToken, PropertyFindUser } from '../interfaces/auth.interface'
import type CreateUserDto from '../models/user.dto'
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
    await this.isUserExists(username)
    const HashedPassword = await bcrypt.hash(password, 10)
    const createdUser = await User.create({
      username,
      password: HashedPassword
    })
    return createdUser.username
  }

  public async login (userData: CreateUserDto): Promise<string[]> {
    const { username, password }: { username: string, password: string } = userData
    this.isDataFull(username, password)
    const currentUser = await this.findUserByProperty({ username })
    const match = await bcrypt.compare(password, currentUser.password)
    if (match === null || !match) throw new HttpException(401, 'Unauthorized')
    const [accessToken, refreshToken] = await this.generateTokens(username)
    await this.saveRefreshToken(currentUser, refreshToken)
    return [accessToken, refreshToken]
  }

  public async refresh (refreshToken: string): Promise<string> {
    this.isRefreshTokenExists(refreshToken)
    const currentUser = await this.findUserByProperty({ refreshToken })
    if (currentUser == null) throw new HttpException(403, 'Forbidden')
    this.verifyToken(refreshToken, currentUser.username)
    const [accessToken] = await this.generateTokens(currentUser.username)
    return accessToken
  }

  private async isUserExists (username: string): Promise<boolean> {
    const duplicate = await User.findOne({ username })
    if (duplicate != null) {
      throw new HttpException(409, 'User already exists!')
    }
    return false
  }

  private isDataFull (username: string, password: string): void {
    if (username === '' || password === '' || username === undefined || password === undefined) {
      throw new HttpException(400, 'Username and password are required')
    }
  }

  private isRefreshTokenExists (token: string): void {
    if (token === undefined || token === '') {
      throw new HttpException(401, 'Unauthorized')
    }
  }

  private async findUserByProperty (property: PropertyFindUser): Promise<Document<unknown, any, UserModel> & Omit<UserModel & {
    _id: Types.ObjectId
  }, never>> {
    const user = await User.findOne(property).exec()
    if (user == null) {
      throw new HttpException(401, 'Unauthorized')
    }
    return user
  }

  private async generateTokens (username: string): Promise<[string, string]> {
    const payload: JwtPayload = {
      username
    }
    const accessToken = jwt.sign(
      payload,
      this.accessSecret,
      { expiresIn: '30s' }
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
  }, never>, token: string): Promise<void> {
    userData.refreshToken = token
    await userData.save()
  }

  private verifyToken (token: string, username: string): void {
    const decoded = jwt.verify(token, this.refreshSecret) as DecodedToken
    if (username !== decoded.username) throw new HttpException(403, 'Forbidden')
  }
}

export default AuthService

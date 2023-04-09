import mongoose from 'mongoose'
import { type UserModel } from '../interfaces/auth.interface'
const Schema = mongoose.Schema

const userSchema = new Schema<UserModel>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
})

export const User = mongoose.model<UserModel>('User', userSchema)

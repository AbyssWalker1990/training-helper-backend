import mongoose from 'mongoose'
const Schema = mongoose.Schema

export interface UserModel {
  username: string
  password: string
  refreshToken: string
}

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

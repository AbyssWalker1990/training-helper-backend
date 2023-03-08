import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface User {
  username: string
  password: string,
  refreshToken: string
}

const userSchema = new Schema<User>({
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

const User = mongoose.model<User>('User', userSchema)

export default User
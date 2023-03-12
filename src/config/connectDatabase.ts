import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

const connectDatabase = (): void => {
  const uri = process.env.DATABASE_URI
  mongoose.connect(uri as string)
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
}

export default connectDatabase

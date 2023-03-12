import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

const uri = process.env.DATABASE_URI as string

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(uri)
  } catch (error) {
    console.log(error)
  }
}

export default connectDatabase

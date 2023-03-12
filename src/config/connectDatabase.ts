import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

const connectDatabase = async (): Promise<any> => {
  try {
    const uri = process.env.DATABASE_URI
    await mongoose.connect(uri as string)
  } catch (error) {
    console.log(error)
  }
}

export default connectDatabase

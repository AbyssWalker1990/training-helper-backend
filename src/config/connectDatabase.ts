import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

export const connectDatabase = (): void => {
  const uri = process.env.DATABASE_URI
  mongoose.connect(uri as string)
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
}

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.close()
}

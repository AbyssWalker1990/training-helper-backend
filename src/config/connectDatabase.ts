import mongoose from 'mongoose'
mongoose.set('strictQuery', false)

const LOCAL_DB_URI = 'mongodb://admin:password@localhost:27017'

export const connectDatabase = (): void => {
  let uri
  if (__dirname.startsWith('/home/')) {
    uri = LOCAL_DB_URI
    console.log('LOCAL DATABASE / DOCKER CONTAINER')
  } else {
    uri = process.env.DATABASE_URI
  }
  mongoose.connect(uri as string)
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
}

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.close()
}

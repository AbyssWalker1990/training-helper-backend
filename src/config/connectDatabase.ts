import dotenv from 'dotenv'
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
dotenv.config()

const LOCAL_DB_URI = 'mongodb://admin:password@mongodb:27017'

export const connectDatabase = (): void => {
  let uri
  if (process.env.NODE_ENV === 'development') {
    uri = LOCAL_DB_URI
    console.log('LOCAL DATABASE / DOCKER CONTAINER')
    console.log(uri)
  } else {
    uri = process.env.DATABASE_URI
  }
  mongoose.connect(uri as string)
    .then(() => { console.log('Connect to: ', LOCAL_DB_URI) })
    .catch((err) => {
      console.log(err)
    })
}

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.close()
}

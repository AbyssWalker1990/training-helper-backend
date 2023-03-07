const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI,  {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDatabase
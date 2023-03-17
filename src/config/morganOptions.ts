import fs from 'fs'
import path from 'path'

const accessLogStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' })

const logToConsoleAndFile = (message: string): void => {
  console.log(message)
  accessLogStream.write(`${message}\n`)
}

export default logToConsoleAndFile

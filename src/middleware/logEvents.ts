import { RequestHandler } from 'express';
import { format } from 'date-fns'
import {v4 as uuidv4} from 'uuid'
import fs from 'fs'
import { promises as fsPromises } from 'fs';
import path from 'path'

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'dd-MM-yyyy  kk:mm:ss')}`
  const logItem = `${dateTime}  ${uuidv4()}  ${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
    }

    await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logName), logItem)
  } catch (err) {
    console.log(err)
  }
}

export const logger: RequestHandler = (req, res, next) => {
  logEvents(`${req.method}  ${req.headers.origin}  ${req.url}`, 'requestLog.txt')
  console.log(`${req.method}\t${req.path}`)
  next()
}

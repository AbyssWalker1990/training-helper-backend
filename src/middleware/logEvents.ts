import type { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import fs, { promises as fsPromises } from 'fs'

import path from 'path'

export const logEvents = async (message: string, logName: string): Promise<void> => {
  console.log(message)
  const dateTime = `${format(new Date(), 'dd-MM-yyyy  kk:mm:ss')}`
  const logItem = `${dateTime}  ${uuidv4()}  ${message}\n`
  console.log(logItem)

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (err) {
    console.log(err)
  }
}

export const logger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await logEvents(`${req.method}  ${req.headers.origin as string}  ${req.url}`, 'requestLog.txt')
    console.log(`${req.method}\t${req.path}`)
    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

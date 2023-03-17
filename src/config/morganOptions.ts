import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
import type { TokenIndexer } from 'morgan'
import type { IncomingMessage, ServerResponse } from 'http'

const accessLogStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' })

export const logToConsoleAndFile = (message: string): void => {
  console.log(message)
  accessLogStream.write(`${message}\n`)
}

export const logFormat = (tokens: TokenIndexer, req: IncomingMessage, res: ServerResponse): string => {
  const timeZone = 'Europe/Kiev' // Set the timezone to Kiev
  const timestamp = moment().tz(timeZone).format() // Get the current timestamp in Kiev timezone
  return [
    timestamp,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms',
    tokens['user-agent'](req, res),
    '\n'
  ].join(' ')
}

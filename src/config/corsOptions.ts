import { type CorsOptions } from 'cors'
import allowedHosts from './allowedHosts'

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedHosts.includes(origin as string) || origin === undefined) { // Remove !origin on prod
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions

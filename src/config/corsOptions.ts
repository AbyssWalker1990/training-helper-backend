import { CorsOptions } from 'cors'
import allowedHosts from './allowedHosts'

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin != null) {
      if (allowedHosts.indexOf(origin) !== -1 || !origin) { // Remove !origin on prod
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions
const allowedHosts = require("./allowedHosts")

const corsOptions = {
    origin: (origin, callback) => {
      if (allowedHosts.indexOf(origin) !== -1 || !origin) { // Remove !origin on prod
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    optionsSuccessStatus: 200
  }

  module.exports = corsOptions
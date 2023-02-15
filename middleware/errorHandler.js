const { logEvents } = require('./logEvents')

errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errorLog.txt')
  console.log(err.stack)
  res.status(500).send(err.message)
}

module.exports = errorHandler
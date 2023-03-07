const express = require('express')
const router = express.Router()
const path = require('path')
// const verifyToken = require('../middleware/verifyToken')

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})
// router.route('^/$|/index(.html)?')
//   .get(verifyToken, (req, res) => {
//          res.send('Hi')
//       })
  

module.exports = router


const express = require('express')
const router = express.Router()
// const verifyToken = require('../middleware/verifyToken')

router.get('^/$|/index(.html)?', (req, res) => {
    res.send('Hi')
  })
// router.route('^/$|/index(.html)?')
//   .get(verifyToken, (req, res) => {
//          res.send('Hi')
//       })
  

module.exports = router


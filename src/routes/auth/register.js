const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/authControllers/registerController')

router.post('/', registerController.registerUser)

module.exports = router
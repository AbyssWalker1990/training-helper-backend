const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authControllers/authController')

router.post('/', authController.handleLogin)

module.exports = router
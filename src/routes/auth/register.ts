// import express from 'express'
// import { registerUser } from '../../controllers/authControllers/RegisterController'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user
 *         - password
 *       properties:
 *         user:
 *           type: string
 *           description: Username of new or logging in user
 *         password:
 *           type: string
 *           description: Password for registering or logging in user
 *       example:
 *         user: YourUsername
 *         password: 123456abcd
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       "201":
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: a message
 *                   example: New User Abcdef created!!!
 *       "400":
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a message
 *                   example: Username and password are required
 *       "409":
 *         description: User already exists
 *       "500":
 *         description: Server Error
 */

// const registerRouter = express.Router()

// registerRouter.post('/', (req, res) => {
//   registerUser(req, res)
//     .then(() => {
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

// export default registerRouter

"use strict";
// import express from 'express'
// import { handleLogin } from '../../controllers/authControllers/AuthController'
/**
 * @swagger
 * /auth:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       "200":
 *         description: User authenticated!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZvdmEiLCJpYXQiOjE2Nzg4ODQ0NjEsImV4cCI6MTY3ODg4NTY2MX0.DY5dlRiOZxqyMAlLRNzOJNxPlkkIKhOoN6fQJ87CAr4
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
 *       "401":
 *         description: Unauthorized
 */
// const authRouter = express.Router()
// authRouter.post('/', (req, res) => {
//   handleLogin(req, res)
//     .then(() => {})
//     .catch((err) => {
//       console.log(err)
//     })
// })
// export default authRouter

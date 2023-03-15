"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/authControllers/authController");
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
const authRouter = express_1.default.Router();
authRouter.post('/', (req, res) => {
    (0, authController_1.handleLogin)(req, res)
        .then(() => { })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = authRouter;

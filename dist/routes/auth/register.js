"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../../controllers/authControllers/registerController");
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
const registerRouter = express_1.default.Router();
registerRouter.post('/', (req, res) => {
    (0, registerController_1.registerUser)(req, res)
        .then(() => {
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = registerRouter;

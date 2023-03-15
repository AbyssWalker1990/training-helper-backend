"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const refreshTokenController_1 = require("../../controllers/authControllers/refreshTokenController");
/**
 * @swagger
 * /refresh:
 *   get:
 *     tags: [Auth]
 *     summary: Refresh Access Token
 *     responses:
 *       "200":
 *         description: Get new Access Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZvdmEiLCJpYXQiOjE2Nzg4ODQ0NjEsImV4cCI6MTY3ODg4NTY2MX0.DY5dlRiOZxqyMAlLRNzOJNxPlkkIKhOoN6fQJ87CAr4
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */
const refreshRouter = express_1.default.Router();
refreshRouter.get('/', (req, res) => {
    (0, refreshTokenController_1.handleRefreshToken)(req, res)
        .then(() => { })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = refreshRouter;

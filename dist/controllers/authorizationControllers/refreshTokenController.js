"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
class RefreshTokenController {
    path = '/refresh';
    router = express_1.default.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path, this.handleRefreshToken);
    }
    handleRefreshToken = async (req, res) => {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const cookies = req.cookies;
        if (cookies?.jwt === null)
            return res.sendStatus(401); // Unauthorized
        const refreshToken = cookies.jwt;
        console.log(`Refresh token cookie: ${refreshToken}`);
        const currentUser = await User_1.User.findOne({ refreshToken }).exec();
        if (currentUser != null) {
            console.log(`User refresh token: ${currentUser.refreshToken}`);
            console.log(`Name: ${currentUser.username}`);
        }
        if (currentUser == null)
            return res.sendStatus(403); // Forbidden
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
            if (currentUser.username !== decoded.username)
                return res.sendStatus(403);
            const accessToken = jsonwebtoken_1.default.sign({ username: currentUser.username }, accessSecret, { expiresIn: '20m' });
            res.status(200).json({ accessToken });
        }
        catch (error) {
            return res.sendStatus(403);
        }
    };
}
exports.default = RefreshTokenController;

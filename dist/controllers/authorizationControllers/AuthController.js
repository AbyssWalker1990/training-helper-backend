"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
class AuthController {
    path = '/auth';
    router = express_1.default.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(this.path, this.handleLogin);
    }
    handleLogin = async (req, res) => {
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const { user, password } = req.body;
        if (user === '' || password === '' || user === undefined || password === undefined) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const currentUser = await User_1.User.findOne({ username: user }).exec();
        if (currentUser == null)
            return res.sendStatus(401);
        // Compare password
        const match = await bcrypt_1.default.compare(password, currentUser.password);
        const payload = {
            username: currentUser.username
        };
        if (match !== null) {
            const accessToken = jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn: '20m' });
            const refreshToken = jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: '1d' });
            // Saving refreshToken to current user
            currentUser.refreshToken = refreshToken;
            const result = await currentUser.save();
            console.log(result);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({ accessToken });
        }
        else {
            res.sendStatus(401);
        }
    };
}
exports.default = AuthController;

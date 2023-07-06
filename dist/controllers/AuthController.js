"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const user_dto_1 = __importDefault(require("../models/user.dto"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    path = '/auth';
    router = express_1.default.Router();
    authService = new auth_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(`${this.path}/login`, this.handleLogin);
        this.router.post(`${this.path}/register`, (0, validationMiddleware_1.default)(user_dto_1.default), this.registerUser);
        this.router.post(`${this.path}/refresh`, this.handleRefreshToken);
        this.router.get(`${this.path}/logout`, this.handleLogout);
    }
    handleLogin = async (req, res, next) => {
        const userData = req.body;
        const username = userData.username;
        try {
            const [accessToken, refreshToken] = await this.authService.login(userData);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({ username, accessToken, refreshToken });
        }
        catch (error) {
            next(error);
        }
    };
    registerUser = async (req, res, next) => {
        const userData = req.body;
        try {
            const user = await this.authService.register(userData);
            res.status(201).json({ success: `New user ${user} created!` });
        }
        catch (error) {
            next(error);
        }
    };
    handleRefreshToken = async (req, res, next) => {
        const refreshToken = req.body.refreshToken;
        console.log(refreshToken);
        try {
            const accessToken = await this.authService.refresh(refreshToken);
            res.status(200).json({ accessToken });
        }
        catch (error) {
            next(error);
        }
    };
    handleLogout = async (req, res) => {
        const cookies = req.cookies;
        if (cookies.jwt === null)
            return res.sendStatus(204);
        const refreshToken = cookies.jwt;
        const foundUser = await User_1.User.findOne({ refreshToken }).exec();
        if (foundUser == null) {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(204); // No content
        }
        foundUser.refreshToken = '';
        await foundUser.save();
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.sendStatus(204);
    };
}
exports.default = AuthController;

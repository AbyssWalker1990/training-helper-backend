"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
class AuthController {
    path = '/auth';
    router = express_1.default.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(`${this.path}/login`, this.handleLogin);
        this.router.post(`${this.path}/register`, this.registerUser);
        this.router.get(`${this.path}/refresh`, this.handleRefreshToken);
        this.router.get(`${this.path}/logout`, this.handleLogout);
    }
    handleLogin = async (req, res, next) => {
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const { user, password } = req.body;
        if (user === '' || password === '' || user === undefined || password === undefined) {
            // return res.status(400).json({ message: 'Username and password are required' })
            next(new HttpException_1.default(400, 'Username and password are required'));
            return;
        }
        const currentUser = await User_1.User.findOne({ username: user }).exec();
        if (currentUser == null) {
            next(new HttpException_1.default(401, 'Unauthorized'));
            return;
        }
        // Compare password
        const match = await bcrypt_1.default.compare(password, currentUser.password);
        console.log('Match: ', match);
        const payload = {
            username: currentUser.username
        };
        if (match !== null && match) {
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
            next(new HttpException_1.default(401, 'Unauthorized'));
        }
    };
    registerUser = async (req, res, next) => {
        const { user, password } = req.body;
        if (user === '' || password === '' || user === undefined || password === undefined) {
            next(new HttpException_1.default(400, 'Username and password are required'));
            return;
        }
        // Check if user alreasy exists
        const duplicate = await User_1.User.findOne({ username: user }).exec();
        if (duplicate != null) {
            next(new HttpException_1.default(409, 'User already exists!'));
        }
        try {
            const HashedPassword = await bcrypt_1.default.hash(password, 10);
            const result = await User_1.User.create({
                username: user,
                password: HashedPassword
            });
            console.log(result);
            res.status(201).json({ success: `New User ${user} created!!!` });
        }
        catch (error) {
            next(new HttpException_1.default(500, error.message));
        }
    };
    handleRefreshToken = async (req, res, next) => {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const cookies = req.cookies;
        if (cookies.jwt === null || cookies.jwt === undefined) {
            console.log('NO COOKIES');
            next(new HttpException_1.default(401, 'Unauthorized'));
            return;
        }
        const refreshToken = cookies.jwt;
        console.log(`Refresh token cookie: ${refreshToken}`);
        if (refreshToken === undefined) {
            console.log('REFRESH TOKEN UNDEFINED');
            next(new HttpException_1.default(401, 'Unauthorized'));
            return;
        }
        const currentUser = await User_1.User.findOne({ refreshToken }).exec();
        if (currentUser != null) {
            console.log(`User refresh token: ${currentUser.refreshToken}`);
            console.log(`Name: ${currentUser.username}`);
        }
        if (currentUser == null) {
            next(new HttpException_1.default(403, 'Forbidden'));
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
            if (currentUser.username !== decoded.username) {
                next(new HttpException_1.default(403, 'Forbidden'));
                return;
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: currentUser.username }, accessSecret, { expiresIn: '20m' });
            res.status(200).json({ accessToken });
        }
        catch (error) {
            next(new HttpException_1.default(403, 'Forbidden'));
        }
    };
    // Can't delete access token from there, DONT FORGET WHEN STARTING build frontend
    handleLogout = async (req, res) => {
        const cookies = req.cookies;
        console.log('COOKIES JWT: ', cookies.jwt);
        if (cookies.jwt === null)
            return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;
        // Check database for refresh token
        const foundUser = await User_1.User.findOne({ refreshToken }).exec();
        if (foundUser == null) {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(204); // No content
        }
        // Delete refreshToken in db
        foundUser.refreshToken = '';
        const result = await foundUser.save();
        console.log(result);
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.sendStatus(204);
    };
}
exports.default = AuthController;

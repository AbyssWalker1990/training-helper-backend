"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    accessSecret;
    refreshSecret;
    constructor() {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    }
    async register(userData) {
        const { username, password } = userData;
        this.isDataFull(username, password);
        await this.isUserExists(username);
        const HashedPassword = await bcrypt_1.default.hash(password, 10);
        const createdUser = await User_1.User.create({
            username,
            password: HashedPassword
        });
        return createdUser.username;
    }
    async login(userData) {
        const { username, password } = userData;
        this.isDataFull(username, password);
        const currentUser = await this.findUserByProperty({ username });
        const match = await bcrypt_1.default.compare(password, currentUser.password);
        if (match === null || !match)
            throw new HttpException_1.default(401, 'Unauthorized');
        const [accessToken, refreshToken] = await this.generateTokens(username);
        await this.saveRefreshToken(currentUser, refreshToken);
        return [accessToken, refreshToken];
    }
    async refresh(refreshToken) {
        this.isRefreshTokenExists(refreshToken);
        const currentUser = await this.findUserByProperty({ refreshToken });
        if (currentUser == null)
            throw new HttpException_1.default(403, 'Forbidden');
        this.verifyToken(refreshToken, currentUser.username);
        const [accessToken] = await this.generateTokens(currentUser.username);
        return accessToken;
    }
    async isUserExists(username) {
        const duplicate = await User_1.User.findOne({ username });
        if (duplicate != null) {
            throw new HttpException_1.default(409, 'User already exists!');
        }
        return false;
    }
    isDataFull(username, password) {
        if (username === '' || password === '' || username === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
    }
    isRefreshTokenExists(token) {
        if (token === undefined || token === '') {
            throw new HttpException_1.default(401, 'Unauthorized');
        }
    }
    async findUserByProperty(property) {
        const user = await User_1.User.findOne(property).exec();
        if (user == null) {
            throw new HttpException_1.default(401, 'Unauthorized');
        }
        return user;
    }
    async generateTokens(username) {
        const payload = {
            username
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.accessSecret, { expiresIn: '3h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.refreshSecret, { expiresIn: '1d' });
        return [accessToken, refreshToken];
    }
    async saveRefreshToken(userData, token) {
        userData.refreshToken = token;
        await userData.save();
    }
    verifyToken(token, username) {
        const decoded = jsonwebtoken_1.default.verify(token, this.refreshSecret);
        if (username !== decoded.username)
            throw new HttpException_1.default(403, 'Forbidden');
    }
}
exports.default = AuthService;

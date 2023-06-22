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
        console.log('HashedPassword: ', HashedPassword);
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
    async refresh(cookies) {
        this.isCookiesExists(cookies);
        const refreshToken = cookies.jwt;
        this.isRefreshTokenExists(refreshToken);
        console.log(`Refresh token cookie: ${refreshToken}`);
        const currentUser = await this.findUserByProperty({ refreshToken });
        console.log('currentUser: ', currentUser);
        if (currentUser != null) {
            console.log(`User refresh token: ${currentUser.refreshToken}`);
            console.log(`Name: ${currentUser.username}`);
        }
        if (currentUser == null) {
            throw new HttpException_1.default(403, 'Forbidden');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, this.refreshSecret);
            if (currentUser.username !== decoded.username) {
                throw new HttpException_1.default(403, 'Forbidden');
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: currentUser.username }, this.accessSecret, { expiresIn: '20m' });
            return accessToken;
        }
        catch (error) {
            throw new HttpException_1.default(403, 'Forbidden');
        }
    }
    async isUserExists(username) {
        const duplicate = await User_1.User.findOne({ username });
        if (duplicate != null) {
            throw new HttpException_1.default(409, 'User already exists!');
        }
        return false;
    }
    async findUserByProperty(property) {
        console.log('property: ', property);
        const user = await User_1.User.findOne(property).exec();
        console.table(user);
        if (user == null) {
            throw new HttpException_1.default(401, 'Unauthorized');
        }
        return user;
    }
    isDataFull(username, password) {
        if (username === '' || password === '' || username === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
    }
    async generateTokens(username) {
        const payload = {
            username
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.accessSecret, { expiresIn: '20m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.refreshSecret, { expiresIn: '1d' });
        return [accessToken, refreshToken];
    }
    async saveRefreshToken(userData, token) {
        console.log('REFRESH TOKEN FROM saveRefreshToken: ', token);
        userData.refreshToken = token;
        await userData.save();
    }
    isCookiesExists(cookies) {
        if (cookies.jwt === null || cookies.jwt === undefined) {
            console.log('NO COOKIES');
            throw new HttpException_1.default(401, 'Unauthorized');
        }
    }
    isRefreshTokenExists(token) {
        if (token === undefined) {
            console.log('REFRESH TOKEN UNDEFINED');
            throw new HttpException_1.default(401, 'Unauthorized');
        }
    }
}
exports.default = AuthService;

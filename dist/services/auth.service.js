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
    async register(userData) {
        const { user, password } = userData;
        if (user === '' || password === '' || user === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
        // Check if user alreasy exists
        const duplicate = await User_1.User.findOne({ username: user }).exec();
        if (duplicate != null) {
            throw new HttpException_1.default(409, 'User already exists!');
        }
        try {
            const HashedPassword = await bcrypt_1.default.hash(password, 10);
            const result = await User_1.User.create({
                username: user,
                password: HashedPassword
            });
            return result.username;
        }
        catch (error) {
            throw new HttpException_1.default(500, error.message);
        }
    }
    async login(userData) {
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const { user, password } = userData;
        if (user === '' || password === '' || user === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
        const currentUser = await User_1.User.findOne({ username: user }).exec();
        if (currentUser == null) {
            throw new HttpException_1.default(401, 'Unauthorized');
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
            return [accessToken, refreshToken];
        }
        else {
            throw new HttpException_1.default(401, 'Unauthorized');
        }
    }
    async refresh(cookies) {
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const jwtCookie = cookies;
        if (jwtCookie.jwt === null || jwtCookie.jwt === undefined) {
            console.log('NO COOKIES');
            throw new HttpException_1.default(401, 'Unauthorized');
        }
        const refreshToken = jwtCookie.jwt;
        console.log(`Refresh token cookie: ${refreshToken}`);
        if (refreshToken === undefined) {
            console.log('REFRESH TOKEN UNDEFINED');
            throw new HttpException_1.default(401, 'Unauthorized');
        }
        const currentUser = await User_1.User.findOne({ refreshToken }).exec();
        if (currentUser != null) {
            console.log(`User refresh token: ${currentUser.refreshToken}`);
            console.log(`Name: ${currentUser.username}`);
        }
        if (currentUser == null) {
            throw new HttpException_1.default(403, 'Forbidden');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
            if (currentUser.username !== decoded.username) {
                throw new HttpException_1.default(403, 'Forbidden');
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: currentUser.username }, accessSecret, { expiresIn: '20m' });
            return accessToken;
        }
        catch (error) {
            throw new HttpException_1.default(403, 'Forbidden');
        }
    }
}
exports.default = AuthService;

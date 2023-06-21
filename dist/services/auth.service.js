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
        const { username, password } = userData;
        if (username === '' || password === '' || username === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
        let createdUser;
        try {
            await this.isUserExists(username);
            const HashedPassword = await bcrypt_1.default.hash(password, 10);
            console.log('HashedPassword: ', HashedPassword);
            createdUser = await User_1.User.create({
                username,
                password: HashedPassword
            });
        }
        catch (error) {
            throw new HttpException_1.default(500, error.message);
        }
        return createdUser.username;
    }
    async login(userData) {
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const { username, password } = userData;
        if (username === '' || password === '' || username === undefined || password === undefined) {
            throw new HttpException_1.default(400, 'Username and password are required');
        }
        const currentUser = await this.findUserByUsername(username);
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
    async isUserExists(username) {
        const duplicate = await User_1.User.findOne({ username });
        if (duplicate != null) {
            throw new HttpException_1.default(409, 'User already exists!');
        }
        return false;
    }
    async findUserByUsername(username) {
        const user = await User_1.User.findOne({ username }).exec();
        if (user == null) {
            throw new HttpException_1.default(401, 'Unauthorized');
        }
        return user;
    }
}
exports.default = AuthService;

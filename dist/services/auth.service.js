"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
            console.log(result);
            return result.username;
        }
        catch (error) {
            throw new HttpException_1.default(500, error.message);
        }
    }
}
exports.default = AuthService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const mongoose_1 = require("mongoose");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
(0, globals_1.describe)('AuthService', () => {
    const authService = new auth_service_1.default();
    (0, globals_1.describe)('isUserExists', () => {
        (0, globals_1.test)('Returns false if can not find user in database', async () => {
            jest.spyOn(mongoose_1.Query.prototype, 'exec').mockResolvedValue(null);
            const user = await auth_service_1.default.prototype.isUserExists('username');
            console.log('USER from test: ', user);
            (0, globals_1.expect)(user).toBe(false);
        });
        (0, globals_1.test)('Throw error if user already exists in database', async () => {
            jest.spyOn(mongoose_1.Query.prototype, 'exec').mockResolvedValueOnce('anyValue');
            const authServiceProto = Object.getPrototypeOf(authService);
            await (0, globals_1.expect)(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException_1.default(409, 'User already exists!'));
        });
    });
    (0, globals_1.describe)('register', () => {
        (0, globals_1.test)('Returns username of created user', async () => {
            const userData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(auth_service_1.default.prototype, 'isUserExists').mockResolvedValue(false);
            jest.spyOn(User_1.User, 'create').mockReturnValue(userData);
            const result = await authService.register(userData);
            (0, globals_1.expect)(result).toBe('username');
        });
        (0, globals_1.test)('Throws an error when password is blank', async () => {
            const blankPasswordUserData = {
                username: 'username',
                password: ''
            };
            await (0, globals_1.expect)(authService.register(blankPasswordUserData)).rejects.toThrow(new HttpException_1.default(400, 'Username and password are required'));
        });
        (0, globals_1.test)('Throws an error when username is blank', async () => {
            const blankPasswordUserData = {
                username: '',
                password: 'password'
            };
            await (0, globals_1.expect)(authService.register(blankPasswordUserData)).rejects.toThrow(new HttpException_1.default(400, 'Username and password are required'));
        });
    });
    (0, globals_1.describe)('login', () => {
        (0, globals_1.test)('Returns an array with accessToken and refreshToken', async () => {
            const loginData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(auth_service_1.default.prototype, 'findUserByUsername').mockReturnValue(loginData);
            jest.spyOn(bcrypt_1.default, 'compare').mockReturnValue(true);
            jest.spyOn(auth_service_1.default.prototype, 'generateTokens').mockResolvedValue(['token', 'token']);
            jest.spyOn(auth_service_1.default.prototype, 'saveRefreshToken').mockResolvedValue(true);
            const result = await authService.login(loginData);
            (0, globals_1.expect)(result).toEqual(['token', 'token']);
        });
        (0, globals_1.test)('Returns an error if username or password doesnt match', async () => {
            const loginData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(auth_service_1.default.prototype, 'findUserByUsername').mockReturnValue(loginData);
            jest.spyOn(bcrypt_1.default, 'compare').mockReturnValue(false);
            await (0, globals_1.expect)(authService.login(loginData)).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
        });
    });
});

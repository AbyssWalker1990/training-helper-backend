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
    let authService;
    beforeAll(() => {
        process.env = Object.assign(process.env, { REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET });
    });
    beforeEach(() => {
        authService = new auth_service_1.default();
    });
    (0, globals_1.describe)('register', () => {
        (0, globals_1.test)('Returns username of created user', async () => {
            const userData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(authService, 'isUserExists').mockResolvedValueOnce(false);
            jest.spyOn(User_1.User, 'create').mockReturnValueOnce(userData);
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
        (0, globals_1.test)('Returns an array with accessToken and refreshToken if passed proper credentials', async () => {
            const loginData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(authService, 'findUserByProperty').mockReturnValue(loginData);
            jest.spyOn(bcrypt_1.default, 'compare').mockReturnValue(true);
            jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce(['token', 'token']);
            jest.spyOn(authService, 'saveRefreshToken').mockResolvedValue(true);
            const result = await authService.login(loginData);
            (0, globals_1.expect)(result).toEqual(['token', 'token']);
        });
        (0, globals_1.test)('Returns an error if username or password doesnt match', async () => {
            const loginData = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(authService, 'findUserByProperty').mockReturnValueOnce(loginData);
            jest.spyOn(bcrypt_1.default, 'compare').mockReturnValue(false);
            await (0, globals_1.expect)(authService.login(loginData)).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
        });
        (0, globals_1.test)('Returns an error if username is blank', async () => {
            const loginData = {
                username: '',
                password: 'password'
            };
            await (0, globals_1.expect)(authService.login(loginData)).rejects.toThrow(new HttpException_1.default(400, 'Username and password are required'));
        });
        (0, globals_1.test)('Returns an error if password is blank', async () => {
            const loginData = {
                username: 'username',
                password: ''
            };
            await (0, globals_1.expect)(authService.login(loginData)).rejects.toThrow(new HttpException_1.default(400, 'Username and password are required'));
        });
    });
    (0, globals_1.describe)('refresh', () => {
        (0, globals_1.test)('Returns access token if user have proper cookies with refreshToken', async () => {
            const user = {
                username: 'username',
                password: 'password'
            };
            jest.spyOn(authService, 'verifyToken').mockReturnValue(true);
            jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce(['token', 'token']);
            jest.spyOn(authService, 'findUserByProperty').mockReturnValueOnce(user);
            const result = await authService.refresh('CoRrEcT-ToKen');
            (0, globals_1.expect)(result).toBe('token');
        });
        (0, globals_1.test)('Throws an error when there is no user in database', async () => {
            jest.spyOn(authService, 'isRefreshTokenExists').mockResolvedValueOnce(true);
            jest.spyOn(authService, 'findUserByProperty').mockResolvedValueOnce(null);
            await (0, globals_1.expect)(authService.refresh('CoRrEcT-ToKen')).rejects.toThrow(new HttpException_1.default(403, 'Forbidden'));
        });
    });
    (0, globals_1.describe)('isUserExists', () => {
        (0, globals_1.test)('Returns false if can not find user in database', async () => {
            jest.spyOn(mongoose_1.Model, 'findOne').mockResolvedValueOnce(null);
            const user = await authService.isUserExists('username');
            (0, globals_1.expect)(user).toBe(false);
        });
        (0, globals_1.test)('Throws an error if user already exists in database', async () => {
            jest.spyOn(mongoose_1.Model, 'findOne').mockResolvedValueOnce('anyValue');
            const authServiceProto = Object.getPrototypeOf(authService);
            await (0, globals_1.expect)(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException_1.default(409, 'User already exists!'));
        });
    });
});

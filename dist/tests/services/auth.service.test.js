"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const mongoose_1 = require("mongoose");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
(0, globals_1.describe)('AuthService', () => {
    const authService = new auth_service_1.default();
    (0, globals_1.describe)('isUserExists', () => {
        (0, globals_1.test)('Returns false if can not find user in database', async () => {
            jest.spyOn(mongoose_1.Query.prototype, 'exec').mockResolvedValue(null);
            const authServiceProto = Object.getPrototypeOf(authService);
            const user = await authServiceProto.isUserExists('username');
            (0, globals_1.expect)(user).toBe(false);
        });
        (0, globals_1.test)('Throw error if user already exists in database', async () => {
            jest.spyOn(mongoose_1.Query.prototype, 'exec').mockResolvedValue('anyValue');
            const authServiceProto = Object.getPrototypeOf(authService);
            await (0, globals_1.expect)(authServiceProto.isUserExists('username')).rejects.toThrow(new HttpException_1.default(409, 'User already exists!'));
        });
    });
});

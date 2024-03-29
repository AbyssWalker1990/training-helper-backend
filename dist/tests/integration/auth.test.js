"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../app"));
const AuthController_1 = __importDefault(require("../../controllers/AuthController"));
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const connectDatabase_1 = require("../../config/connectDatabase");
const User_1 = require("../../models/User");
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', false);
const PORT = 3501;
const app = new app_1.default([
    new AuthController_1.default()
], PORT);
app.listen();
const testUserData = {
    username: 'testuser',
    password: 'testpassword'
};
describe('auth', () => {
    beforeAll(async () => {
        (0, connectDatabase_1.connectDatabase)();
        mongoose_1.default.connection.once('open', () => {
            console.log('Successfully connected to database!');
        });
        const authService = new auth_service_1.default();
        await authService.register(testUserData);
    });
    afterAll(async () => {
        await User_1.User.deleteOne({ username: 'testuser' });
        await User_1.User.deleteOne({ username: 'validusername' });
        await mongoose_1.default.disconnect();
        await mongoose_1.default.connection.close();
    });
    // LOGIN
    describe('login route', () => {
        describe('given not full credentials', () => {
            it('should return a 400', async () => {
                const invalidUserData = { username: 'invaliduser' };
                const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(invalidUserData);
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    message: 'Username and password are required',
                    status: 400
                });
            });
        });
        describe('given wrong credentials', () => {
            it('should return 401', async () => {
                const invalidUserData = { username: 'invaliduser', password: 'invalidpass' };
                const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(invalidUserData);
                expect(statusCode).toBe(401);
                expect(body).toEqual({
                    status: 401,
                    message: 'Unauthorized'
                });
            });
        });
        describe('given correct credentials', () => {
            it('should return 200', async () => {
                const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(testUserData);
                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String),
                    username: 'testuser'
                });
            });
        });
    });
    // REGISTER
    describe('register route', () => {
        describe('given not full credentials, no password', () => {
            it('should return a 400', async () => {
                const invalidUserData = { username: 'invaliduser' };
                const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/register/').send(invalidUserData);
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    message: 'password must be a string,password must be longer than or equal to 4 characters',
                    status: 400
                });
            });
        });
    });
    describe('login equals to already existing user', () => {
        it('should return 409', async () => {
            const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/register/').send(testUserData);
            expect(statusCode).toBe(409);
            expect(body).toEqual({
                status: 409,
                message: 'User already exists!'
            });
        });
    });
    describe('given valid credentials', () => {
        it('should return 200', async () => {
            const validRegisterData = {
                username: 'validusername',
                password: 'validpassword'
            };
            const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/register/').send(validRegisterData);
            expect(statusCode).toBe(201);
            expect(body).toEqual({
                success: 'New user validusername created!'
            });
        });
    });
});

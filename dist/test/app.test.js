"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../app"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const SwaggerController_1 = __importDefault(require("../controllers/SwaggerController"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) ?? 3500;
const app = new app_1.default([
    new AuthController_1.default(),
    new SwaggerController_1.default()
], PORT);
app.listen();
const testUserData = {
    user: 'testuser',
    password: 'testpassword'
};
describe('auth', () => {
    beforeAll(async () => {
        const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const authService = new auth_service_1.default();
        await mongoose_1.default.connect(mongoServer.getUri());
        await authService.register(testUserData);
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoose_1.default.connection.close();
    });
    // LOGIN
    describe('login route', () => {
        describe('given not full credentials', () => {
            it('should return a 400', async () => {
                const invalidUserData = { user: 'invaliduser' };
                const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(invalidUserData);
                console.log('BODY: ', body);
                expect(statusCode).toBe(400);
                expect(body).toEqual({
                    message: 'Username and password are required',
                    status: 400
                });
            });
        });
        describe('given wrong credentials', () => {
            it('should return 401', async () => {
                const invalidUserData = { user: 'invaliduser', password: 'invalidpass' };
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
                expect(body).toEqual({ accessToken: expect.any(String) });
            });
        });
    });
    // REGISTER
    describe('register route', () => {
        describe('given not full credentials', () => {
            it('should return a 400', async () => {
                const invalidUserData = { user: 'invaliduser' };
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
        it('should return 201', async () => {
            const validUserData = {
                user: 'testuservalid',
                password: 'testuservalid'
            };
            const { statusCode, body } = await (0, supertest_1.default)(app.getServer()).post('/auth/register/').send(validUserData);
            expect(statusCode).toBe(201);
            expect(body).toEqual({
                success: `New user ${validUserData.user} created!`
            });
        });
    });
});

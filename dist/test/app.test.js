"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const User_1 = require("../models/User");
describe('POST /register', () => {
    it('registers a new user and returns an accessToken', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/register')
            .send({
            user: 'testuser',
            password: 'testpassword'
        })
            .expect(201)
            .expect('Content-Type', /json/);
        expect(typeof response.body.success).toBe('string');
    });
});
describe('POST /auth', () => {
    it('Returns access token if username and password are correct', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/auth')
            .send({
            user: 'testuser',
            password: 'testpassword'
        })
            .expect(200)
            .expect('Content-Type', /json/);
        expect(typeof response.body.accessToken).toBe('string');
    });
});
describe('GET /refresh', () => {
    it('Refreshing Access token', async () => {
        const auth = await (0, supertest_1.default)(server_1.default)
            .post('/auth')
            .send({
            user: 'testuser',
            password: 'testpassword'
        });
        const cookie = auth.headers['set-cookie'][0];
        const token = cookie.split(';')[0].split('=')[1];
        const response = await (0, supertest_1.default)(server_1.default)
            .get('/refresh')
            .set('Cookie', `jwt=${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(typeof response.body.accessToken).toBe('string');
    });
});
describe('GET /logout', () => {
    it('Logout user', async () => {
        await (0, supertest_1.default)(server_1.default)
            .get('/logout')
            .expect(204);
    });
});
afterAll(async () => {
    // remove test user
    const testUser = await User_1.User.findOne({ username: 'testuser' });
    await testUser?.remove();
    console.log('Test user REMOVED');
});

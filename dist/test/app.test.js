"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../app"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const SwaggerController_1 = __importDefault(require("../controllers/SwaggerController"));
const PORT = Number(process.env.PORT) ?? 3500;
const app = new app_1.default([
    new AuthController_1.default(),
    new SwaggerController_1.default()
], 3500);
app.listen();
describe('auth', () => {
    beforeAll(async () => {
        const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoose_1.default.connection.close();
    });
    describe('login route', () => {
        describe('given not full credentials', () => {
            it('should return a 400', async () => {
                const userData = { user: 'invaliduser' };
                await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(userData).expect(400);
            });
        });
        describe('given wrong credentials', () => {
            it('should return 401', async () => {
                const userData = { user: 'invaliduser', password: 'invalidpass' };
                await (0, supertest_1.default)(app.getServer()).post('/auth/login/').send(userData).expect(401);
            });
        });
    });
});

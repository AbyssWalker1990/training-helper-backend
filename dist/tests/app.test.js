"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const TrainingController_1 = __importDefault(require("../controllers/TrainingController"));
const TestController_1 = __importDefault(require("../controllers/TestController"));
const SwaggerController_1 = __importDefault(require("../controllers/SwaggerController"));
describe('App', () => {
    const app = new app_1.default([
        new AuthController_1.default(),
        new TrainingController_1.default(),
        new TestController_1.default(),
        new SwaggerController_1.default()
    ], 3501);
    test('getServer', () => {
        const server = app.getServer();
        expect(server).not.toBe(null);
        expect(server).not.toBe(undefined);
    });
});

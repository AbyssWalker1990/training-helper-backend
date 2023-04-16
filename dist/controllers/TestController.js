"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_services_1 = __importDefault(require("../services/test.services"));
class TestController {
    path = '/test';
    router = express_1.default.Router();
    testService = new test_services_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(`${this.path}/create`, this.createRandomTraining);
    }
    createRandomTraining = async () => {
        const createdTraining = await this.testService.createRandomTraining('Vova');
    };
}
exports.default = TestController;

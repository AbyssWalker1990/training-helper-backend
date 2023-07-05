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
        this.router.get(`${this.path}/delete-all`, this.deleteTestTrainings);
    }
    createRandomTraining = async (req, res, next) => {
        try {
            for (let i = 0; i < 30; i++) {
                await this.testService.createRandomTraining('Test');
            }
            res.status(201).json({ success: 'Test Trainings has been created!!!' });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    };
    deleteTestTrainings = async (req, res, next) => {
        try {
            await this.testService.deleteAllTestTrainings();
            console.log('test Trainings deleted');
            res.status(204).json({ success: 'Test Trainings successfully deleted!' });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = TestController;

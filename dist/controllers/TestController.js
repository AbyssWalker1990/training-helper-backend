"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class TestController {
    path = '/test';
    router = express_1.default.Router();
    constructor() {
    }
    initRoutes() {
        this.router.get(`${this.path}/`, this.createRandomTraining);
    }
    createRandomTraining = (username) => {
        const randomTraining = 'Training';
        return randomTraining;
    };
}

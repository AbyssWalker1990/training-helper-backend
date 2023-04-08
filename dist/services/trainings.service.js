"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
const MissingDataException_1 = __importDefault(require("../exceptions/trainingsExceptions/MissingDataException"));
class TrainingService {
    async createSingleTraining(username, title, exercises) {
        this.isValidTraining(username, title);
        const newTraining = await Training_1.Training.create({
            username,
            title,
            exercises
        });
        return newTraining;
    }
    isValidTraining(username, title) {
        if (username === '' || username === null || username === undefined) {
            throw new MissingDataException_1.default('Username required to create new training instance');
        }
        if (title === '' || title === null || title === undefined) {
            throw new MissingDataException_1.default('Title required to create new training instance');
        }
    }
}
exports.default = TrainingService;

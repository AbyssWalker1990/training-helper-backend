"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
const MissingDataException_1 = __importDefault(require("../exceptions/trainingsExceptions/MissingDataException"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const User_1 = require("../models/User");
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
    async deleteSingleTraining(cookies, trainingId) {
        this.isAccessToken(cookies);
        const accessToken = cookies.jwt;
        const currentUser = await this.isExistingUser(accessToken);
        const currentUserName = currentUser.username;
        const training = await Training_1.Training.findById(trainingId);
        this.isOwnerOfTraining(training, currentUserName);
        await Training_1.Training.findByIdAndDelete(trainingId);
    }
    isAccessToken(cookies) {
        if (cookies?.jwt === null)
            throw new HttpException_1.default(401, 'Unauthorized');
    }
    isOwnerOfTraining(training, currentUser) {
        if (training.username !== currentUser)
            throw new HttpException_1.default(403, 'Forbidden');
    }
    async isExistingUser(token) {
        const currentUser = await User_1.User.findOne({ refreshToken: token }).exec();
        if (currentUser == null)
            throw new HttpException_1.default(403, 'Forbidden');
        return currentUser;
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

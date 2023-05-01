"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
const MissingDataException_1 = __importDefault(require("../exceptions/trainingsExceptions/MissingDataException"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TrainingService {
    accessSecret;
    constructor() {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
    }
    async createSingleTraining(username, title, exercises) {
        this.isValidTraining(username, title);
        const createdTraining = await Training_1.Training.create({
            username,
            title,
            exercises
        });
        return createdTraining;
    }
    async deleteSingleTraining(cookies, trainingId) {
        this.isAccessToken(cookies);
        const accessToken = cookies.jwt;
        const currentUser = await this.isExistingUser(accessToken);
        const currentUserName = currentUser.username;
        const training = await Training_1.Training.findById(trainingId);
        if (training === null) {
            throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
        }
        this.isOwnerOfTraining(training, currentUserName);
        await Training_1.Training.findByIdAndDelete(trainingId);
    }
    async getAllTrainingsByUser(cookies) {
        this.isAccessToken(cookies);
        const accessToken = cookies.jwt;
        console.log('accessToken: ', accessToken);
        const currentUser = await this.decodeUserName(accessToken, this.accessSecret);
        const trainingList = await Training_1.Training.find({ username: currentUser.username });
        console.log('trainingList: ', trainingList);
        return trainingList;
    }
    async getSingleTrainingById(trainingId) {
        this.isValidTrainingId(trainingId);
        const training = await Training_1.Training.findById(trainingId);
        if (training === null) {
            throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
        }
        const { username, title } = training;
        this.isValidTraining(username, title);
        return training;
    }
    isAccessToken(cookies) {
        if (cookies?.jwt === null)
            throw new HttpException_1.default(401, 'Unauthorized');
    }
    isOwnerOfTraining(training, currentUser) {
        if (training.username !== currentUser)
            throw new HttpException_1.default(403, 'Forbidden, not owner');
    }
    async isExistingUser(token) {
        const currentUser = await this.decodeUserName(token, this.accessSecret);
        if (currentUser == null)
            throw new HttpException_1.default(403, 'Forbidden, user does not exist');
        return currentUser;
    }
    isValidTrainingId(trainingId) {
        if (trainingId == null || trainingId === undefined || trainingId === '') {
            throw new MissingDataException_1.default('Invalid training ID');
        }
    }
    isValidTraining(username, title) {
        if (username === '' || username === null || username === undefined) {
            throw new MissingDataException_1.default('Username required to create new training instance');
        }
        if (title === '' || title === null || title === undefined) {
            throw new MissingDataException_1.default('Title required to create new training instance');
        }
    }
    async decodeUserName(token, secret) {
        console.log('DECODE START');
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log('DECODE FINISH');
        const currentUser = await User_1.User.findOne({ username: decoded.username }).exec();
        console.log('----------------------------');
        console.log(`currentUser FROM DB: ${JSON.stringify(currentUser)}`);
        return currentUser;
    }
}
exports.default = TrainingService;

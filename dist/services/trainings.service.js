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
const mongoose_1 = __importDefault(require("mongoose"));
class TrainingService {
    accessSecret;
    refreshSecret;
    constructor() {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    }
    async createSingleTraining(username, title, exercises) {
        this.isValidTraining(username, title);
        try {
            const createdTraining = await Training_1.Training.create({
                username,
                title,
                exercises
            });
            return createdTraining;
        }
        catch (error) {
            throw new HttpException_1.default(error.status ?? 500, error.message);
        }
    }
    async deleteSingleTraining(cookies, trainingId) {
        console.log('isAccessToken: ', cookies.jwt);
        this.isAccessToken(cookies);
        const accessToken = cookies.jwt;
        try {
            const currentUser = await this.isExistingUser(accessToken);
            const currentUserName = currentUser.username;
            console.log('currentUserName: ', currentUserName);
            const training = await Training_1.Training.findById(trainingId);
            console.log('training: ', training);
            if (training === null)
                throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
            this.isOwnerOfTraining(training, currentUserName);
            return await Training_1.Training.findByIdAndDelete(trainingId);
        }
        catch (error) {
            throw new HttpException_1.default(error.status ?? 500, error.message);
        }
    }
    async getAllTrainingsByUser(token) {
        try {
            const currentUser = await this.decodeUserName(token, this.accessSecret);
            const trainingList = await Training_1.Training.find({ username: currentUser.username }, {}, { sort: { date: -1 } });
            return trainingList;
        }
        catch (error) {
            throw new HttpException_1.default(error.status ?? 500, error.message);
        }
    }
    async getSingleTrainingById(trainingId) {
        this.isValidTrainingId(trainingId);
        try {
            const training = await Training_1.Training.findById(trainingId);
            if (training === null)
                throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
            return training;
        }
        catch (error) {
            if (error.name === 'CastError')
                throw new HttpException_1.default(500, 'Incorrect ID');
            throw new HttpException_1.default(error.status ?? 500, error.message);
        }
    }
    async updateSingleTrainingById(trainingId, trainingData) {
        const { title, exercises } = trainingData;
        console.log(new mongoose_1.default.Types.ObjectId(trainingId));
        try {
            const currentTraining = await Training_1.Training.updateOne({ _id: new mongoose_1.default.Types.ObjectId(trainingId) }, { title, exercises });
            console.log('currentTraining: ', currentTraining);
            if (currentTraining.matchedCount === 0)
                throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
        }
        catch (error) {
            throw new HttpException_1.default(error.status ?? 500, error.message);
        }
    }
    isAccessToken(cookies) {
        if (cookies?.jwt === null || cookies?.jwt === '')
            throw new HttpException_1.default(401, 'Unauthorized');
    }
    isOwnerOfTraining(training, currentUser) {
        if (training.username !== currentUser)
            throw new HttpException_1.default(403, 'Forbidden, not owner');
    }
    async isExistingUser(token) {
        console.log('isExistingUser TRIGGERED');
        const currentUser = await this.decodeUserName(token, this.refreshSecret);
        if (currentUser == null)
            throw new HttpException_1.default(403, 'Forbidden, user does not exist');
        return currentUser;
    }
    isValidTrainingId(trainingId) {
        if (trainingId == null ||
            trainingId === undefined ||
            trainingId === '' ||
            typeof trainingId !== 'string') {
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
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const currentUser = await User_1.User.findOne({ username: decoded.username }).exec();
            return currentUser;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new HttpException_1.default(401, 'Access Token Expired!');
            throw new HttpException_1.default(500, error.name);
        }
    }
}
exports.default = TrainingService;

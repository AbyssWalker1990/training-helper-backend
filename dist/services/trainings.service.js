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
    refreshSecret;
    constructor() {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
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
        return await Training_1.Training.findByIdAndDelete(trainingId);
    }
    async getAllTrainingsByUser(token) {
        this.isAccessTokenString(token);
        const currentUser = await this.decodeUserName(token, this.accessSecret);
        const trainingList = await Training_1.Training.find({ username: currentUser.username });
        return trainingList;
    }
    async getSingleTrainingById(trainingId, next) {
        this.isValidTrainingId(trainingId);
        try {
            const training = await Training_1.Training.findById(trainingId);
            if (training === null)
                throw new MissingDataException_1.default(`There is no training with ${trainingId} ID`);
            return training;
        }
        catch (error) {
            if (error.name === 'CastError')
                next(new HttpException_1.default(500, 'Incorrect ID'));
            next(error);
        }
    }
    isAccessToken(cookies) {
        if (cookies?.jwt === null || cookies?.jwt === '')
            throw new HttpException_1.default(401, 'Unauthorized');
    }
    isAccessTokenString(token) {
        if (token === undefined || typeof token !== 'string')
            throw new HttpException_1.default(401, 'Unauthorized');
    }
    isOwnerOfTraining(training, currentUser) {
        if (training.username !== currentUser)
            throw new HttpException_1.default(403, 'Forbidden, not owner');
    }
    async isExistingUser(token) {
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

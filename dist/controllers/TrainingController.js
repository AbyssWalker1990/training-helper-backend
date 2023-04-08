"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Training_1 = require("../models/Training");
const User_1 = require("../models/User");
const trainings_service_1 = __importDefault(require("../services/trainings.service"));
class TrainingController {
    path = '/trainings';
    router = express_1.default.Router();
    trainingService = new trainings_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(`${this.path}/`, this.createTraining);
        this.router.get(`${this.path}/user`, this.getTrainingsByUser);
        this.router.get(`${this.path}/:trainingId`, this.getTrainingById);
        this.router.delete(`${this.path}/:trainingId`, this.deleteTraining);
    }
    createTraining = async (req, res, next) => {
        try {
            const { username, title, exercises } = req.body;
            const newTraining = await this.trainingService.createSingleTraining(username, title, exercises);
            res.status(201).json({ success: `New Training ${newTraining.title} created!!!` });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    };
    deleteTraining = async (req, res, next) => {
        try {
            const cookies = req.cookies;
            const trainingId = req.params.trainingId;
            await this.trainingService.deleteSingleTraining(cookies, trainingId);
        }
        catch (error) {
            next(error);
        }
    };
    getTrainingsByUser = async (req, res) => {
        const cookies = req.cookies;
        if (cookies?.jwt === null)
            return res.sendStatus(401); // Unauthorized
        const accessToken = cookies.jwt;
        console.log('ACCESS TOKEN: ' + accessToken);
        // Need to be replaced later with access token
        const currentUser = await User_1.User.findOne({ refreshToken: accessToken }).exec();
        if (currentUser == null)
            return res.sendStatus(403); // Forbidden
        const currentUserName = currentUser.username;
        try {
            const trainingList = await Training_1.Training.find({ username: currentUserName });
            res.status(200).json(trainingList);
        }
        catch (error) {
            console.log(error);
        }
    };
    getTrainingById = async (req, res) => {
        const trainingId = req.params.trainingId;
        if (trainingId == null || trainingId === undefined || trainingId === '') {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        try {
            const training = await Training_1.Training.findById(trainingId);
            if (training !== null && training !== undefined) {
                res.status(200).json(training);
            }
            console.log(training);
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.default = TrainingController;

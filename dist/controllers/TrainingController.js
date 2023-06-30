"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
        this.router.post(`${this.path}/user`, this.getTrainingsByUser);
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
            next(error);
        }
    };
    deleteTraining = async (req, res, next) => {
        try {
            const cookies = req.cookies;
            const trainingId = req.params.trainingId;
            await this.trainingService.deleteSingleTraining(cookies, trainingId);
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    };
    getTrainingsByUser = async (req, res, next) => {
        const { token } = req.body;
        try {
            const trainingList = await this.trainingService.getAllTrainingsByUser(token);
            res.status(200).json(trainingList);
        }
        catch (error) {
            next(error);
        }
    };
    getTrainingById = async (req, res, next) => {
        const trainingId = req.params.trainingId;
        try {
            const training = await this.trainingService.getSingleTrainingById(trainingId);
            res.status(200).json(training);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = TrainingController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createTrainingController_1 = __importDefault(require("../../controllers/trainingControllers/createTrainingController"));
const getTrainingController_1 = require("../../controllers/trainingControllers/getTrainingController");
const deleteTraining_1 = __importDefault(require("../../controllers/trainingControllers/deleteTraining"));
const trainingRouter = express_1.default.Router();
trainingRouter.post('/', (req, res) => {
    (0, createTrainingController_1.default)(req, res)
        .catch((err) => { console.log(err); });
});
trainingRouter.get('/user', (req, res) => {
    (0, getTrainingController_1.getTrainingsByUser)(req, res)
        .catch((err) => { console.log(err); });
});
trainingRouter.get('/:trainingId', (req, res) => {
    (0, getTrainingController_1.getTrainingById)(req, res)
        .catch((err) => { console.log(err); });
});
trainingRouter.delete('/:trainingId', (req, res) => {
    (0, deleteTraining_1.default)(req, res)
        .catch((err) => { console.log(err); });
});
exports.default = trainingRouter;

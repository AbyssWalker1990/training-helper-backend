"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createTrainingController_1 = __importDefault(require("../../controllers/trainingControllers/createTrainingController"));
const trainingRouter = express_1.default.Router();
trainingRouter.post('/', (req, res) => {
    (0, createTrainingController_1.default)(req, res)
        .catch((err) => { console.log(err); });
});
exports.default = trainingRouter;

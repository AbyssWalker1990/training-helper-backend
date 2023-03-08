"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const refreshRouter = express_1.default.Router();
const refreshTokenController_1 = __importDefault(require("../../controllers/authControllers/refreshTokenController"));
refreshRouter.get('/', refreshTokenController_1.default);
exports.default = refreshRouter;

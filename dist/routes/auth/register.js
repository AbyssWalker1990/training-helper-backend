"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerRouter = express_1.default.Router();
const registerController_1 = require("../../controllers/authControllers/registerController");
registerRouter.post('/', registerController_1.registerUser);
exports.default = registerRouter;

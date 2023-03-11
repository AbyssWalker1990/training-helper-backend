"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logoutRouter = express_1.default.Router();
const logoutController_1 = require("../../controllers/authControllers/logoutController");
logoutRouter.get('/', logoutController_1.handleLogout);
exports.default = logoutRouter;

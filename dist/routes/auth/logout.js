"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logoutController_1 = require("../../controllers/authControllers/logoutController");
const logoutRouter = express_1.default.Router();
logoutRouter.get('/', (req, res) => {
    (0, logoutController_1.handleLogout)(req, res)
        .then(() => {
        console.log('success');
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = logoutRouter;

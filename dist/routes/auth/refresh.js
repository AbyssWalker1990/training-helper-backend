"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const refreshTokenController_1 = require("../../controllers/authControllers/refreshTokenController");
const refreshRouter = express_1.default.Router();
refreshRouter.get('/', (req, res) => {
    (0, refreshTokenController_1.handleRefreshToken)(req, res)
        .then(() => {
        console.log('success');
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = refreshRouter;

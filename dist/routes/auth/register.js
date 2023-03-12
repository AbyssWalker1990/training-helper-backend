"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../../controllers/authControllers/registerController");
const registerRouter = express_1.default.Router();
registerRouter.post('/', (req, res) => {
    (0, registerController_1.registerUser)(req, res)
        .then(() => {
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = registerRouter;

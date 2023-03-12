"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../../controllers/authControllers/registerController");
const router = express_1.default.Router();
router.post('/', (req, res) => {
    (0, registerController_1.registerUser)(req, res)
        .then(() => {
        console.log('success');
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.default = router;

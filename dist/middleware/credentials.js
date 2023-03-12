"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedHosts_1 = __importDefault(require("../config/allowedHosts"));
const credentials = (req, res, next) => {
    const origin = req.header('Origin');
    if (allowedHosts_1.default.includes(origin)) {
        res.set('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
exports.default = credentials;

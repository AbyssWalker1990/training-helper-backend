"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedHosts_1 = __importDefault(require("../config/allowedHosts"));
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin != null) {
        if (allowedHosts_1.default.includes(origin)) {
            // res.headers('Access-Control-Allow-Credentials', true)
            console.log('OK');
        }
    }
    next();
};
exports.default = credentials;

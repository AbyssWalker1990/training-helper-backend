"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedHosts_1 = __importDefault(require("./allowedHosts"));
const corsOptions = {
    origin: (origin, callback) => {
        if (origin != null) {
            if (allowedHosts_1.default.indexOf(origin) !== -1 || !origin) { // Remove !origin on prod
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    optionsSuccessStatus: 200
};
exports.default = corsOptions;

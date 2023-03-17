"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join('logs', 'access.log'), { flags: 'a' });
const logToConsoleAndFile = (message) => {
    console.log(message);
    accessLogStream.write(`${message}\n`);
};
exports.default = logToConsoleAndFile;

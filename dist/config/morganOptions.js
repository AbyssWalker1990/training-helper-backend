"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFormat = exports.logToConsoleAndFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join('logs', 'access.log'), { flags: 'a' });
const logToConsoleAndFile = (message) => {
    console.log(message);
    accessLogStream.write(`${message}\n`);
};
exports.logToConsoleAndFile = logToConsoleAndFile;
const logFormat = (tokens, req, res) => {
    const timeZone = 'Europe/Kiev'; // Set the timezone to Kiev
    const timestamp = (0, moment_timezone_1.default)().tz(timeZone).format(); // Get the current timestamp in Kiev timezone
    return [
        timestamp,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        tokens['user-agent'](req, res),
        '\n'
    ].join(' ');
};
exports.logFormat = logFormat;
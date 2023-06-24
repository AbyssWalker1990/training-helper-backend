"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFormat = exports.logToConsoleAndFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', 'logs', 'access.log'), { flags: 'a' });
const logToConsoleAndFile = (message) => {
    console.log(message);
    accessLogStream.write(`${message}`);
};
exports.logToConsoleAndFile = logToConsoleAndFile;
const logFormat = (tokens, req, res) => {
    // const timeZone = 'Europe/Kiev' // Set the timezone to Kiev
    // const timestamp = moment().tz(timeZone).format() // Get the current timestamp in Kiev timezone
    const timestamp = new Date();
    return [
        timestamp,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        tokens['user-agent'](req, res)
    ].join(' ');
};
exports.logFormat = logFormat;

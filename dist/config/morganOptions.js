"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFormat = exports.logToConsoleAndFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', 'logs', 'access.log'), { flags: 'a' });
const logToConsoleAndFile = (message) => {
    console.log(message);
    accessLogStream.write(`${message}`);
};
exports.logToConsoleAndFile = logToConsoleAndFile;
const logFormat = (tokens, req, res) => {
    const timestamp = `${(0, date_fns_1.format)(new Date(), 'dd-MM-yyyy  kk:mm:ss')}`;
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

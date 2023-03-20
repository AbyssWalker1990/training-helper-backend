"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const logEvents = async (message, logName) => {
    console.log(message);
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'dd-MM-yyyy  kk:mm:ss')}`;
    const logItem = `${dateTime}  ${(0, uuid_1.v4)()}  ${message}\n`;
    console.log(logItem);
    try {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'logs'))) {
            await fs_1.promises.mkdir(path_1.default.join(__dirname, '..', 'logs'));
        }
        await fs_1.promises.appendFile(path_1.default.join(__dirname, '..', 'logs', logName), logItem);
    }
    catch (err) {
        console.log(err);
    }
};
exports.logEvents = logEvents;
const logger = async (req, res, next) => {
    try {
        await (0, exports.logEvents)(`${req.method}  ${req.headers.origin}  ${req.url}`, 'requestLog.txt');
        console.log(`${req.method}\t${req.path}`);
        next();
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.logger = logger;

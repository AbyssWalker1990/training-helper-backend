"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("fs");
const path_1 = __importDefault(require("path"));
const logEvents = async (message, logName) => {
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'dd-MM-yyyy  kk:mm:ss')}`;
    const logItem = `${dateTime}  ${(0, uuid_1.v4)()}  ${message}\n`;
    try {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', 'logs'))) {
            await fs_2.promises.mkdir(path_1.default.join(__dirname, '..', '..', 'logs'));
        }
        await fs_2.promises.appendFile(path_1.default.join(__dirname, '..', '..', 'logs', logName), logItem);
    }
    catch (err) {
        console.log(err);
    }
};
exports.logEvents = logEvents;
const logger = (req, res, next) => {
    (0, exports.logEvents)(`${req.method}  ${req.headers.origin}  ${req.url}`, 'requestLog.txt');
    console.log(`${req.method}\t${req.path}`);
    next();
};
exports.logger = logger;

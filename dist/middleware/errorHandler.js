"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = require("./logEvents");
const errorHandler = (err, req, res, next) => {
    (0, logEvents_1.logEvents)(`${err.name}: ${err.message}`, 'errorLog.txt')
        .then(() => {
        console.log(err.stack);
        res.status(500).send(err.message);
    })
        .catch((error) => {
        console.log(err.stack);
        next(error);
    });
};
exports.default = errorHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = require("./logEvents");
function errorMiddleware(err, req, res, next) {
    const status = err.status;
    const message = err.message;
    (0, logEvents_1.logEvents)(message, 'errorLog.log')
        .catch((err) => { console.log(err); });
    return res.status(status).json({ status, message });
}
exports.default = errorMiddleware;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncMiddleware = (middlewareFunction) => {
    return (req, res, next) => {
        middlewareFunction(req, res, next).catch(next);
    };
};
exports.default = asyncMiddleware;

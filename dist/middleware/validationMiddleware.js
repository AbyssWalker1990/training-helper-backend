"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
function validationMiddleware(type) {
    return (req, res, next) => {
        (0, class_validator_1.validate)((0, class_transformer_1.plainToInstance)(type, req.body))
            .then((errors) => {
            if (errors.length > 0) {
                const message = errors.map((error) => {
                    if (error.constraints != null) {
                        return Object.values(error.constraints);
                    }
                    else {
                        return '';
                    }
                }).join(', ');
                next(new HttpException_1.default(400, message));
            }
            else {
                next();
            }
        })
            .catch((err) => { console.log(err); });
    };
}
exports.default = validationMiddleware;

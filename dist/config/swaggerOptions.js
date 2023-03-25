"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Training Helper API',
            version: '1.0.0',
            description: 'Simple app for training notes'
        },
        servers: [
            {
                url: 'http://localhost:3500'
            },
            {
                url: 'https://large-periodic-guan.glitch.me/'
            }
        ]
    },
    apis: [
        path_1.default.join(__dirname, 'swagger_api/*.yaml')
    ]
};
const specsSwagger = (0, swagger_jsdoc_1.default)(options);
exports.default = specsSwagger;

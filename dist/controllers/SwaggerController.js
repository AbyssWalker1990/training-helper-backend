"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = __importDefault(require("../config/swaggerOptions"));
const express_1 = __importDefault(require("express"));
class SwaggerController {
    path = '';
    router = express_1.default.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOptions_1.default));
    }
}
exports.default = SwaggerController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const morgan_1 = __importDefault(require("morgan"));
const morganOptions_1 = require("./config/morganOptions");
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const helmet_1 = __importDefault(require("helmet"));
const helmetOptions_1 = __importDefault(require("./config/helmetOptions"));
class App {
    app;
    port;
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initMiddlewares();
        this.initControllers(controllers);
        this.initErrorMiddleware();
    }
    initMiddlewares() {
        this.app.use((0, morgan_1.default)(morganOptions_1.logFormat, { stream: { write: morganOptions_1.logToConsoleAndFile } }));
        this.app.use(credentials_1.default);
        const cspMiddleware = helmet_1.default.contentSecurityPolicy(helmetOptions_1.default);
        this.app.use(cspMiddleware);
        this.app.use((0, cors_1.default)(corsOptions_1.default));
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.app.use((0, cookie_parser_1.default)());
    }
    initControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    initErrorMiddleware() {
        this.app.use(errorMiddleware_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
    getServer() {
        return this.app;
    }
}
exports.default = App;

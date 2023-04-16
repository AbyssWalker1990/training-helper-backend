"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase_1 = require("./config/connectDatabase");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const app_1 = __importDefault(require("./app"));
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const SwaggerController_1 = __importDefault(require("./controllers/SwaggerController"));
const TrainingController_1 = __importDefault(require("./controllers/TrainingController"));
const TestController_1 = __importDefault(require("./controllers/TestController"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) ?? 3500;
const app = new app_1.default([
    new AuthController_1.default(),
    new TrainingController_1.default(),
    new SwaggerController_1.default(),
    new TestController_1.default()
], PORT);
moment_timezone_1.default.tz.setDefault('Europe/Kiev');
// Connect to database
(0, connectDatabase_1.connectDatabase)();
mongoose_1.default.connection.once('open', () => {
    console.log('Successfully connected to database!');
    app.listen();
});
// app.all('*', (req: Request, res: Response) => {
//   res.status(404)
//   if (req.accepts('html') as boolean) {
//     res.send('404') // Switch to simple html page later
//   } else if (req.accepts('html') as boolean) {
//     res.json({ error: '404 Not Found' })
//   } else {
//     res.type('txt').send('404 Not Found')
//   }
// })
// app.use(errorHandler)
exports.default = app;

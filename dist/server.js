"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase_1 = require("./config/connectDatabase");
const root_1 = __importDefault(require("./routes/root"));
const register_1 = __importDefault(require("./routes/auth/register"));
const auth_1 = __importDefault(require("./routes/auth/auth"));
const refresh_1 = __importDefault(require("./routes/auth/refresh"));
const logout_1 = __importDefault(require("./routes/auth/logout"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = __importDefault(require("./config/swaggerOptions"));
const morganOptions_1 = require("./config/morganOptions");
const morgan_1 = __importDefault(require("morgan"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3500;
moment_timezone_1.default.tz.setDefault('Europe/Kiev');
// Connect to database
(0, connectDatabase_1.connectDatabase)();
// Simple custom logger
// app.use(asyncMiddleware(logger))
app.use((0, morgan_1.default)(morganOptions_1.logFormat, { stream: { write: morganOptions_1.logToConsoleAndFile } }));
// Extra check before CORS
app.use(credentials_1.default);
// CORS
app.use((0, cors_1.default)(corsOptions_1.default));
// Built-in middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '/public')));
// For refreshToken
app.use((0, cookie_parser_1.default)());
// routes
app.use('/', root_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOptions_1.default));
app.use('/register', register_1.default);
app.use('/auth', auth_1.default);
app.use('/refresh', refresh_1.default);
app.use('/logout', logout_1.default);
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send('404'); // Switch to simple html page later
    }
    else if (req.accepts('html')) {
        res.json({ error: '404 Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});
app.use(errorHandler_1.default);
mongoose_1.default.connection.once('open', () => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
});
exports.default = app;

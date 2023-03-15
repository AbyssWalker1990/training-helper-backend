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
const asyncMiddleware_1 = __importDefault(require("./middleware/asyncMiddleware"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase_1 = __importDefault(require("./config/connectDatabase"));
const root_1 = __importDefault(require("./routes/root"));
const register_1 = __importDefault(require("./routes/auth/register"));
const auth_1 = __importDefault(require("./routes/auth/auth"));
const refresh_1 = __importDefault(require("./routes/auth/refresh"));
const logout_1 = __importDefault(require("./routes/auth/logout"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
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
            }
        ]
    },
    apis: [
        path_1.default.join(__dirname, 'routes/auth/*.js')
    ]
};
console.log('API: ', options.apis);
const specs = (0, swagger_jsdoc_1.default)(options);
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3500;
// Connect to database
(0, connectDatabase_1.default)();
// Simple custom logger
app.use((0, asyncMiddleware_1.default)(logEvents_1.logger));
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
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
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

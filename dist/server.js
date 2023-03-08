"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase_1 = __importDefault(require("./config/connectDatabase"));
const PORT = process.env.PORT || 3500;
const root_1 = __importDefault(require("./routes/root"));
const registerController = __importStar(require("./controllers/authControllers/registerController"));
// Connect to database
(0, connectDatabase_1.default)();
// Simple custom logger
app.use(logger);
// Extra check before CORS
// app.use(credentials)
// CORS
// app.use(cors(corsOptions))
// Built-in middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '/public')));
// For refreshToken
app.use(cookieParser());
//routes
app.use('/', root_1.default);
app.use('/register', registerController.registerUser);
app.use('/auth', require('./routes/auth/auth'));
app.use('/refresh', require('./routes/auth/refresh'));
app.use('/logout', require('./routes/auth/logout'));
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send('404'); // Switch to simple html page later
    }
    else if (req.accepts('html')) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});
app.use(errorHandler);
mongoose_1.default.connection.once('open', () => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

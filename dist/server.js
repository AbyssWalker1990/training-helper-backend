"use strict";
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
const mongoose = require('mongoose');
const connectDatabase = require('./config/connectDatabase');
const PORT = process.env.PORT || 3500;
const root_1 = __importDefault(require("./routes/root"));
// Connect to database
connectDatabase();
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
app.use('/register', require('./routes/auth/register'));
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
mongoose.connection.once('open', () => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

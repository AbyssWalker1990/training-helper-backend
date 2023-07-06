"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectDatabase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', false);
const LOCAL_DB_URI = 'mongodb://admin:password@mongodb:27017';
const connectDatabase = () => {
    let uri;
    if (process.env.NODE_ENV === 'development') {
        uri = LOCAL_DB_URI;
    }
    else {
        uri = process.env.DATABASE_URI;
    }
    mongoose_1.default.connect(uri)
        .then(() => { console.log('Connect to: ', uri); })
        .catch((err) => {
        console.log(err);
    });
};
exports.connectDatabase = connectDatabase;
const closeDatabase = async () => {
    await mongoose_1.default.connection.close();
};
exports.closeDatabase = closeDatabase;

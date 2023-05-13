"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
const LOCAL_DB_URI = 'mongodb://admin:password@mongodb:27017';
const connectDatabase = () => {
    let uri;
    if (__dirname.startsWith('/home/')) {
        uri = LOCAL_DB_URI;
        console.log('LOCAL DATABASE / DOCKER CONTAINER');
        console.log(uri);
    }
    else {
        uri = process.env.DATABASE_URI;
    }
    mongoose_1.default.connect(uri)
        .then(() => { console.log('Connect to: ', LOCAL_DB_URI); })
        .catch((err) => {
        console.log(err);
    });
};
exports.connectDatabase = connectDatabase;
const closeDatabase = async () => {
    await mongoose_1.default.connection.close();
};
exports.closeDatabase = closeDatabase;

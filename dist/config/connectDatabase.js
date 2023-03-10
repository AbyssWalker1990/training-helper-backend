"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
const connectDatabase = () => {
    const uri = process.env.DATABASE_URI;
    mongoose_1.default.connect(uri)
        .then(() => { })
        .catch((err) => {
        console.log(err);
    });
};
exports.default = connectDatabase;

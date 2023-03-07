"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
const uri = process.env.DATABASE_URI;
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(uri);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = connectDatabase;

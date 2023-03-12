"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
const connectDatabase = async () => {
    try {
        const uri = process.env.DATABASE_URI;
        await mongoose_1.default.connect(uri);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = connectDatabase;

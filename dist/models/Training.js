"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Training = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const trainingSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    exercises: [
        {
            position: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            set: [{
                    setPos: {
                        type: Number,
                        required: true
                    },
                    reps: {
                        type: Number,
                        required: true
                    },
                    weight: {
                        type: Number
                    }
                }]
        }
    ]
});
exports.Training = mongoose_1.default.model('Training', trainingSchema);

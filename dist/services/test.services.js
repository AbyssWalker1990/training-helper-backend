"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
const exercisesList_1 = __importDefault(require("../config/exercisesList"));
class TestService {
    async createRandomTraining(username) {
        const title = 'Test training';
        const exercises = this.createExercisesList();
        const createdTraining = await Training_1.Training.create({
            username,
            title,
            exercises
        });
        return createdTraining;
    }
    deleteAllTestTrainings = async () => {
        await Training_1.Training.deleteMany({ title: 'Test training' });
    };
    createExercisesList = () => {
        const exercises = [];
        for (let i = 1; i < this.getRandomNumber(4, 10); i++) {
            const sets = this.createSetListForSingleExercise();
            const exercise = {
                position: i,
                name: exercisesList_1.default[this.getRandomNumber(0, exercisesList_1.default.length - 1)],
                sets
            };
            exercises.push(exercise);
        }
        return exercises;
    };
    createSetListForSingleExercise = () => {
        const sets = [];
        for (let i = 1; i < this.getRandomNumber(4, 10); i++) {
            const singleSet = {
                setPos: i,
                reps: this.getRandomNumber(4, 25),
                weight: this.getRandomNumber(10, 250)
            };
            sets.push(singleSet);
        }
        return sets;
    };
    getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    findAllTestTrainings = async () => {
        const testTrainingsList = await Training_1.Training.find({ title: 'Test training' });
        return testTrainingsList;
    };
}
exports.default = TestService;

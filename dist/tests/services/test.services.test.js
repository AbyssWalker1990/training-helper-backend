"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_services_1 = __importDefault(require("../../services/test.services"));
const Training_1 = require("../../models/Training");
describe('TestService', () => {
    const testService = new test_services_1.default();
    describe('createSetListForSingleExercise', () => {
        test('Returns array of sets for exercise', () => {
            const result = testService.createSetListForSingleExercise();
            expect(result).toBeInstanceOf(Array);
        });
    });
    describe('createExercisesList', () => {
        test('Returns list with random proper exercises', () => {
            const result = testService.createExercisesList();
            expect(result).toBeInstanceOf(Array);
        });
    });
    describe('createRandomTraining', () => {
        test('Returns one proper random training', async () => {
            jest.spyOn(Training_1.Training, 'create').mockResolvedValueOnce('training');
            const result = await testService.createRandomTraining('username');
            expect(result).toBe('training');
        });
    });
});

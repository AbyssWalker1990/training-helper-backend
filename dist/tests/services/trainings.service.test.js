"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const trainings_service_1 = __importDefault(require("../../services/trainings.service"));
const Training_1 = require("../../models/Training");
const MissingDataException_1 = __importDefault(require("../../exceptions/trainingsExceptions/MissingDataException"));
(0, globals_1.describe)('TrainingService', () => {
    const trainingService = new trainings_service_1.default();
    const exercises = [
        {
            position: 1,
            name: 'Arm press',
            sets: [{
                    setPos: 1,
                    reps: 12,
                    weight: 200
                },
                {
                    setPos: 2,
                    reps: 12,
                    weight: 200
                },
                {
                    setPos: 3,
                    reps: 12,
                    weight: 200
                }]
        }
    ];
    (0, globals_1.describe)('createSingleTraining', () => {
        (0, globals_1.test)('Returns training object', async () => {
            const finalTraining = {
                username: 'username',
                title: 'testTraining',
                exercises
            };
            jest.spyOn(Training_1.Training, 'create').mockReturnValueOnce(finalTraining);
            const result = await trainingService.createSingleTraining('username', 'testTraining', exercises);
            (0, globals_1.expect)(result).toEqual(finalTraining);
        });
        (0, globals_1.test)('Throws an error if username is blank', async () => {
            await (0, globals_1.expect)(trainingService.createSingleTraining('', 'testTraining', exercises))
                .rejects.toThrow(new MissingDataException_1.default('Username required to create new training instance'));
        });
        (0, globals_1.test)('Throws an error if title is blank', async () => {
            await (0, globals_1.expect)(trainingService.createSingleTraining('username', '', exercises))
                .rejects.toThrow(new MissingDataException_1.default('Title required to create new training instance'));
        });
    });
    (0, globals_1.describe)('deleteSingleTraining', () => {
        const user = {
            username: 'username'
        };
        (0, globals_1.test)('Triggers mongoose delete method if all checking passed', async () => {
            jest.spyOn(trainingService, 'decodeUserName').mockResolvedValueOnce(user);
            jest.spyOn(trainingService, 'isExistingUser').mockResolvedValueOnce(user);
            jest.spyOn(Training_1.Training, 'findById').mockResolvedValueOnce('training');
            jest.spyOn(trainingService, 'isOwnerOfTraining').mockReturnValueOnce(true);
            jest.spyOn(Training_1.Training, 'findByIdAndDelete').mockResolvedValueOnce('deleted');
            const mainFn = jest.spyOn(trainingService, 'deleteSingleTraining');
            const result = await trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef');
            (0, globals_1.expect)(mainFn).toBeCalledTimes(1);
            (0, globals_1.expect)(result).toBe('deleted');
        });
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const trainings_service_1 = __importDefault(require("../../services/trainings.service"));
const Training_1 = require("../../models/Training");
const MissingDataException_1 = __importDefault(require("../../exceptions/trainingsExceptions/MissingDataException"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const express_1 = __importDefault(require("express"));
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
        (0, globals_1.test)('Throws an error if it is not owner', async () => {
            jest.spyOn(trainingService, 'decodeUserName').mockResolvedValueOnce(user);
            jest.spyOn(trainingService, 'isExistingUser').mockResolvedValueOnce(user);
            jest.spyOn(Training_1.Training, 'findById').mockResolvedValueOnce('training');
            globals_1.expect.hasAssertions();
            await (0, globals_1.expect)(trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new HttpException_1.default(403, 'Forbidden, not owner'));
        });
        (0, globals_1.test)('Throws an error if there isnt this training in database', async () => {
            jest.spyOn(trainingService, 'decodeUserName').mockResolvedValueOnce(user);
            jest.spyOn(trainingService, 'isExistingUser').mockResolvedValueOnce(user);
            jest.spyOn(Training_1.Training, 'findById').mockResolvedValueOnce(null);
            globals_1.expect.hasAssertions();
            await (0, globals_1.expect)(trainingService.deleteSingleTraining({ jwt: 'token' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new MissingDataException_1.default('There is no training with 648ec636047ac5ef71312fef ID'));
        });
        (0, globals_1.test)('Throws an error if there is no jwt in cookies', async () => {
            await (0, globals_1.expect)(trainingService.deleteSingleTraining({ jwt: '' }, '648ec636047ac5ef71312fef')).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
        });
    });
    (0, globals_1.describe)('getAllTrainingsByUser', () => {
        const user = {
            username: 'username'
        };
        (0, globals_1.test)('Returns list of trainings', async () => {
            jest.spyOn(trainingService, 'isAccessTokenString').mockReturnValueOnce(true);
            jest.spyOn(trainingService, 'decodeUserName').mockResolvedValueOnce(user);
            jest.spyOn(Training_1.Training, 'find').mockResolvedValueOnce('trainingArray');
            const result = await trainingService.getAllTrainingsByUser('token');
            (0, globals_1.expect)(result).toBe('trainingArray');
        });
        (0, globals_1.test)('Throws an error if token arg is not string', async () => {
            await (0, globals_1.expect)(trainingService.getAllTrainingsByUser(1)).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
            await (0, globals_1.expect)(trainingService.getAllTrainingsByUser(true)).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
            await (0, globals_1.expect)(trainingService.getAllTrainingsByUser([])).rejects.toThrow(new HttpException_1.default(401, 'Unauthorized'));
        });
    });
    (0, globals_1.describe)('getSingleTrainingById', () => {
        (0, globals_1.test)('Returns training object if it exists in database', async () => {
            jest.spyOn(Training_1.Training, 'findById').mockResolvedValueOnce('trainingArray');
            const result = await trainingService.getSingleTrainingById('trainingId', express_1.default);
            (0, globals_1.expect)(result).toBe('trainingArray');
        });
        (0, globals_1.test)('Throw an error training id is not a string', async () => {
            await (0, globals_1.expect)(trainingService.getSingleTrainingById(1, express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
            await (0, globals_1.expect)(trainingService.getSingleTrainingById(true, express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
            await (0, globals_1.expect)(trainingService.getSingleTrainingById([], express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
            await (0, globals_1.expect)(trainingService.getSingleTrainingById('', express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
            await (0, globals_1.expect)(trainingService.getSingleTrainingById(undefined, express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
            await (0, globals_1.expect)(trainingService.getSingleTrainingById(null, express_1.default)).rejects.toThrow(new MissingDataException_1.default('Invalid training ID'));
        });
    });
});

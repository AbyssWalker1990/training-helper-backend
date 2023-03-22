"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingById = exports.getTrainingsByUser = void 0;
const Training_1 = require("../../models/Training");
const User_1 = require("../../models/User");
const getTrainingsByUser = async (req, res) => {
    const cookies = req.cookies;
    if (cookies?.jwt === null)
        return res.sendStatus(401); // Unauthorized
    const accessToken = cookies.jwt;
    console.log('ACCESS TOKEN: ' + accessToken);
    // Need to be replaced later with access token
    const currentUser = await User_1.User.findOne({ refreshToken: accessToken }).exec();
    if (currentUser == null)
        return res.sendStatus(403); // Forbidden
    const currentUserName = currentUser.username;
    try {
        const trainingList = await Training_1.Training.find({ username: currentUserName });
        res.status(200).json(trainingList);
    }
    catch (error) {
        console.log(error);
    }
};
exports.getTrainingsByUser = getTrainingsByUser;
const getTrainingById = async (req, res) => {
    const trainingId = req.params.trainingId;
    if (trainingId == null || trainingId === undefined || trainingId === '') {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const training = await Training_1.Training.findById(trainingId);
        if (training !== null && training !== undefined) {
            res.status(200).json(training);
        }
        console.log(training);
    }
    catch (error) {
        console.log(error);
    }
};
exports.getTrainingById = getTrainingById;

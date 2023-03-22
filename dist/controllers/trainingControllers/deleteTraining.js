"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../../models/Training");
const User_1 = require("../../models/User");
const deleteTraining = async (req, res) => {
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
        const trainingId = req.params.trainingId;
        const training = await Training_1.Training.findById(trainingId);
        if (training.username !== currentUserName)
            return res.sendStatus(403);
        await Training_1.Training.findByIdAndDelete(trainingId);
        console.log(`Training ${training.title} DELETED!`);
        res.status(200).json({ message: `Training ${training.title} DELETED!` });
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = deleteTraining;

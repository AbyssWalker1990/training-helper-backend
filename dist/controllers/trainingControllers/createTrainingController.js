"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../../models/Training");
const createTraining = async (req, res) => {
    try {
        const { username, title, exercises } = req.body;
        if (username === '' || username === null || username === undefined) {
            res.status(400).json({ message: 'Username required' });
        }
        if (title === '' || title === null || title === undefined) {
            res.status(400).json({ message: 'Title required' });
        }
        const newTraining = await Training_1.Training.create({
            username,
            title,
            exercises
        });
        console.log(newTraining);
        res.status(201).json({ success: `New Training ${newTraining.title} created!!!` });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.default = createTraining;

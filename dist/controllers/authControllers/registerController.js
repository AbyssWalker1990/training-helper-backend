"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (req, res) => {
    const { user, password } = req.body;
    if (user === '' || password === '' || user === undefined || password === undefined) {
        res.status(400).json({ message: 'Username and password are required' });
    }
    console.log(`User: ${user}\tPassword: ${password}`);
    // Check if user alreasy exists
    const duplicate = await User_1.User.findOne({ username: user }).exec();
    if (duplicate != null)
        res.sendStatus(409);
    try {
        const HashedPassword = await bcrypt_1.default.hash(password, 10);
        const result = User_1.User.create({
            username: user,
            password: HashedPassword
        });
        console.log(result);
        res.status(201).json({ success: `New User ${user} created!!!` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;

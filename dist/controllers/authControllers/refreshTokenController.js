"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleRefreshToken = async (req, res) => {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(401); // Unauthorized
    const refreshToken = cookies.jwt;
    console.log(`Refresh token cookie: ${refreshToken}`);
    const currentUser = await User_1.default.findOne({ refreshToken }).exec();
    if (currentUser != null) {
        console.log(`User refresh token: ${currentUser.refreshToken}`);
        console.log(`Name: ${currentUser.username}`);
    }
    if (!currentUser)
        return res.sendStatus(403); // Forbidden
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
        if (currentUser.username !== decoded.username)
            return res.sendStatus(403);
        const accessToken = jsonwebtoken_1.default.sign({ "username": currentUser.username }, accessSecret, { expiresIn: '20m' });
        res.json({ accessToken });
    }
    catch (error) {
        return res.sendStatus(403);
    }
};
exports.default = handleRefreshToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User");
const express_1 = __importDefault(require("express"));
class LogoutController {
    path = '/logout';
    router = express_1.default.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path, this.handleLogout);
    }
    // Can't delete access token from there, DONT FORGET WHEN STARTING build frontend
    handleLogout = async (req, res) => {
        const cookies = req.cookies;
        if (cookies?.jwt === null)
            return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;
        // Check database for refresh token
        const foundUser = await User_1.User.findOne({ refreshToken }).exec();
        if (foundUser == null) {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(204); // No content
        }
        // Delete refreshToken in db
        foundUser.refreshToken = '';
        const result = await foundUser.save();
        console.log(result);
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.sendStatus(204);
    };
}
exports.default = LogoutController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Needed for future routes only for authorized users
const verifyToken = (req, res, next) => {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const authHeader = req.headers.authorization ?? req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer '))
        res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, accessSecret);
    console.log('Decoded: ' + decoded);
    // if (decoded === req.name) { // Need to add logic for comparing with database user
    //   next()
    // }
    next();
};
exports.default = verifyToken;
// OLD VESION
// jwt.verify(
//   token,
//   accessSecret,
//   (err, decoded) => {
//     if (err) return res.sendStatus(403)
//     req.user = decoded.username
//     next()
//   }
// )

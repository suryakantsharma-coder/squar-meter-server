"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Missing access token' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

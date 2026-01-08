"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../services/auth.service");
const auth_1 = require("../middleware/auth");
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await (0, auth_service_1.registerUser)(email, password, name);
        res.status(201).json({ message: 'User created', user });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await (0, auth_service_1.loginUser)(email, password, req.ip, req.headers['user-agent']);
        res.json({ accessToken, refreshToken, user });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
});
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newAccess = await (0, auth_service_1.refreshAccessToken)(refreshToken);
        res.json({ accessToken: newAccess });
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
});
router.post('/logout', auth_1.authenticateToken, async (req, res) => {
    try {
        await (0, auth_service_1.logoutUser)(new mongoose_1.Types.ObjectId(req.user.id), req.body.refreshToken);
        res.json({ message: 'Logged out' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;

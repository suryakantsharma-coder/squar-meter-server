"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refreshAccessToken = refreshAccessToken;
exports.logoutUser = logoutUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const user_model_1 = require("../models/user.model");
const session_model_1 = require("../models/session.model");
const config_1 = __importDefault(require("../config"));
async function registerUser(email, password, name) {
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        throw new Error('User already exists');
    const passwordHash = await argon2_1.default.hash(password);
    const user = await user_model_1.User.create({ email, passwordHash, name });
    return user;
}
async function loginUser(email, password, ip, ua) {
    const user = await user_model_1.User.findOne({ email });
    console.log({ user });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await argon2_1.default.verify(user.passwordHash, password);
    console.log({ valid, password, s: user.passwordHash });
    if (!valid)
        throw new Error('Invalid credentials');
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.default.jwtSecret, { expiresIn: config_1.default.accessExpire });
    console.log({ accessToken });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.jwtSecret, {
        expiresIn: config_1.default.refreshExpire,
    });
    console.log({ refreshAccessToken });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    console.log({
        userId: user._id,
        refreshToken,
        userAgent: ua,
        ip,
        expiresAt,
    });
    await session_model_1.Session.create({
        userId: user._id,
        refreshToken,
        userAgent: ua,
        ip,
        expiresAt,
    });
    return { accessToken, refreshToken, user };
}
async function refreshAccessToken(refreshToken) {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwtSecret);
        const session = await session_model_1.Session.findOne({ userId: payload.id, refreshToken });
        if (!session)
            throw new Error('Invalid session');
        const newAccess = jsonwebtoken_1.default.sign({ id: payload.id }, config_1.default.jwtSecret, {
            expiresIn: config_1.default.accessExpire,
        });
        return newAccess;
    }
    catch (err) {
        throw new Error('Invalid refresh token');
    }
}
async function logoutUser(userId, refreshToken) {
    await session_model_1.Session.deleteOne({ userId, refreshToken });
}

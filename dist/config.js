"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Mongo URI ->', process.env.JWT_SECRET);
exports.default = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    accessExpire: process.env.ACCESS_EXPIRE || '15m',
    refreshExpire: process.env.REFRESH_EXPIRE || '7d',
};

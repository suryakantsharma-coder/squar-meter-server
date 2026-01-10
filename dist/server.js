"use strict";
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
// import config from './config';
// import { connectDB } from './database';
// import authRoutes from './routes/auth.routes';
// import projectRoutes from './routes/project.routes';
// import uploadRouter from './routes/upload.routes';
// import unitsRouter from './routes/unit.routes';
// import leadRoutes from './routes/lead.routes';
// import bookingRoutes from './routes/booking.routes';
// import cors from 'cors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'https://zameen-brown.vercel.app'], // your frontend URL
//     credentials: true, // if you use cookies or Authorization headers
//   }),
// );
// app.use('/uploads', express.static('uploads'));
// app.use('/api/auth', authRoutes);
// app.use('/api/project', projectRoutes);
// app.use('/api/upload', uploadRouter);
// app.use('/api/unit', unitsRouter);
// app.use('/api/leads', leadRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));
// connectDB().then(() => {
//   app.listen(config.port, () => console.log(`✅ Server running on port ${config.port}`));
// });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("./config"));
const database_1 = require("./database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const unit_routes_1 = __importDefault(require("./routes/unit.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// CORS FIRST - Allow all origins
app.use((0, cors_1.default)({
    origin: true, // Allows all origins
    credentials: true, // Keeps cookies/auth headers working
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Handle preflight requests
app.options('*', (0, cors_1.default)());
// Then other middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/project', project_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/unit', unit_routes_1.default);
app.use('/api/leads', lead_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));
(0, database_1.connectDB)().then(() => {
    app.listen(config_1.default.port, () => console.log(`✅ Server running on port ${config_1.default.port}`));
});

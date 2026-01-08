"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://zameen-brown.vercel.app'], // your frontend URL
    credentials: true, // if you use cookies or Authorization headers
}));
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

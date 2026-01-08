"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const config_1 = __importDefault(require("../config"));
const booking_service_1 = require("../services/booking.service");
const booking_model_1 = require("../models/booking.model");
const router = express_1.default.Router();
/**
 * Create new booking
 */
router.post('/create', auth_1.authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const data = req.body;
        const isValid = (0, validation_1.validateFields)(true, data);
        if (!isValid)
            throw new Error('All fields are required');
        const bookingData = {
            ...data,
            userId: decoded.id,
        };
        const booking = await (0, booking_service_1.createBooking)(bookingData);
        res.status(201).json({
            message: 'Booking created successfully',
            booking,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/**
 * Update booking
 */
router.put('/update/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id)
            throw new Error('Booking ID is required');
        const updated = await (0, booking_service_1.updateBooking)(id, updates);
        res.status(200).json({
            message: 'Booking updated successfully',
            booking: updated,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/**
 * Delete booking
 */
router.delete('/delete/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error('Booking ID is required');
        const deleted = await (0, booking_service_1.deleteBooking)(id);
        res.status(200).json({
            message: 'Booking deleted successfully',
            deleted,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/**
 * Get ALL bookings with optional filters
 */
// make this as a pagination so data recieved is limited
// router.get('/', authenticateToken, async (req: any, res) => {
//   try {
//     const filters = req.query || {};
//     const page = parseInt(req.query.page as string) || 1;
//     const bookings = await getAllBookings(filters);
//     res.status(200).json({
//       message: 'Bookings fetched successfully',
//       total: bookings.length,
//       bookings,
//     });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        // Extract pagination params first
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Create filters object without pagination params
        const filters = { ...req.query };
        delete filters.page;
        delete filters.limit;
        // total documents count with filters
        const total = await booking_model_1.Booking.countDocuments(filters);
        // paginated data
        const bookings = await booking_model_1.Booking.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance
        res.status(200).json({
            message: 'Bookings fetched successfully',
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            bookings,
        });
    }
    catch (err) {
        console.error('Error fetching bookings:', err); // Add logging
        res.status(400).json({ message: err.message });
    }
});
/**
 * Get single booking
 */
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error('Booking ID is required');
        const booking = await (0, booking_service_1.getBookingById)(id);
        res.status(200).json({
            message: 'Booking fetched successfully',
            booking,
        });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.getBookingById = getBookingById;
exports.getAllBookings = getAllBookings;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
const booking_model_1 = require("../models/booking.model");
// AUTO-GENERATE BOOKING ID like: #book_001
async function generateBookingId() {
    const count = await booking_model_1.Booking.countDocuments();
    const id = (count + 1).toString().padStart(3, '0');
    return `#book_${id}`;
}
/**
 * Create a new booking
 */
async function createBooking(data) {
    // Auto-generate booking ID
    const bookingId = await generateBookingId();
    const payload = {
        ...data,
        bookingId,
    };
    const booking = await booking_model_1.Booking.create(payload);
    return booking;
}
/**
 * Get a booking by ID
 */
async function getBookingById(id) {
    const booking = await booking_model_1.Booking.findById(id);
    if (!booking)
        throw new Error('Booking not found');
    return booking;
}
/**
 * Get all bookings with optional filters
 */
async function getAllBookings(filters = {}) {
    const bookings = await booking_model_1.Booking.find(filters).sort({ createdAt: -1 });
    return bookings;
}
/**
 * Update booking
 */
async function updateBooking(id, updates) {
    const booking = await booking_model_1.Booking.findByIdAndUpdate(id, updates, {
        new: true,
    });
    if (!booking)
        throw new Error('Booking not found');
    return booking;
}
/**
 * Delete booking
 */
async function deleteBooking(id) {
    const deleted = await booking_model_1.Booking.findByIdAndDelete(id);
    if (!deleted)
        throw new Error('Booking not found');
    return deleted;
}

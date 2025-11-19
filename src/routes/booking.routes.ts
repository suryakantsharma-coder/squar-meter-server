import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { validateFields } from '../utils/validation';
import config from '../config';

import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from '../services/booking.service';

import { IBooking } from '../models/booking.model';

const router = express.Router();

/**
 * Create new booking
 */
router.post('/create', authenticateToken, async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    const decoded: any = jwt.verify(token, config.jwtSecret);
    const data = req.body;

    const isValid = validateFields(true, data);
    if (!isValid) throw new Error('All fields are required');

    const bookingData: Partial<IBooking> = {
      ...data,
      userId: decoded.id,
    };

    const booking = await createBooking(bookingData);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update booking
 */
router.put('/update/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) throw new Error('Booking ID is required');

    const updated = await updateBooking(id, updates);

    res.status(200).json({
      message: 'Booking updated successfully',
      booking: updated,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete booking
 */
router.delete('/delete/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error('Booking ID is required');

    const deleted = await deleteBooking(id);

    res.status(200).json({
      message: 'Booking deleted successfully',
      deleted,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Get ALL bookings with optional filters
 */
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const filters = req.query || {};

    const bookings = await getAllBookings(filters);

    res.status(200).json({
      message: 'Bookings fetched successfully',
      total: bookings.length,
      bookings,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Get single booking
 */
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error('Booking ID is required');

    const booking = await getBookingById(id);

    res.status(200).json({
      message: 'Booking fetched successfully',
      booking,
    });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export default router;

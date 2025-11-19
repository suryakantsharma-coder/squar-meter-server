import { Types } from 'mongoose';
import { Booking, IBooking } from '../models/booking.model';

// AUTO-GENERATE BOOKING ID like: #book_001
async function generateBookingId(): Promise<string> {
  const count = await Booking.countDocuments();
  const id = (count + 1).toString().padStart(3, '0');
  return `#book_${id}`;
}

/**
 * Create a new booking
 */
export async function createBooking(data: Partial<IBooking>) {
  // Auto-generate booking ID
  const bookingId = await generateBookingId();

  const payload = {
    ...data,
    bookingId,
  };

  const booking = await Booking.create(payload);
  return booking;
}

/**
 * Get a booking by ID
 */
export async function getBookingById(id: string | Types.ObjectId) {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error('Booking not found');
  return booking;
}

/**
 * Get all bookings with optional filters
 */
export async function getAllBookings(filters: any = {}) {
  const bookings = await Booking.find(filters).sort({ createdAt: -1 });
  return bookings;
}

/**
 * Update booking
 */
export async function updateBooking(id: string | Types.ObjectId, updates: Partial<IBooking>) {
  const booking = await Booking.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!booking) throw new Error('Booking not found');

  return booking;
}

/**
 * Delete booking
 */
export async function deleteBooking(id: string | Types.ObjectId) {
  const deleted = await Booking.findByIdAndDelete(id);
  if (!deleted) throw new Error('Booking not found');
  return deleted;
}

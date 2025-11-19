import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;

  buyerInfo: {
    name: string;
    email: string;
    phone: string;
  };

  project: {
    projectId: mongoose.Types.ObjectId; // referencing the Project model
    block: string;
    unit: string;
  };

  amount: {
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
  };

  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending';

  status: 'Active' | 'Completed' | 'Cancelled';

  bookingDate: Date;

  userId?: mongoose.Types.ObjectId; // who created the booking
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },

    buyerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    project: {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
      },
      block: { type: String, required: true },
      unit: { type: String, required: true },
    },

    amount: {
      totalAmount: { type: Number, required: true },
      paidAmount: { type: Number, required: true },
      balanceAmount: { type: Number, required: true },
    },

    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Pending'],
      default: 'Pending',
    },

    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },

    bookingDate: { type: Date, required: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

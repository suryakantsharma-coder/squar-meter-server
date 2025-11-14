// {
//   _id: ObjectId,
//   projectId: ObjectId("..."),
//   unitNumber: "A-1002",
//   block: "Block B",
//   areaSqft: 1200,
//   price: 12000000,
//   pricePerSqft: 10000,
//   images: [
//     "https://example.com/unit1.jpg"
//   ],
//   status: "Available",
//   buyerId: ObjectId("..."),
//   bookedDate: ISODate("2025-02-18"),
//   createdAt: ISODate(),
//   updatedAt: ISODate()
// }

import mongoose, { Schema, Document } from 'mongoose';

export interface IUnit extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  unitNumber: string;
  block: string;
  areaSqft: number;
  price: number;
  pricePerSqft: number;
  images: string[];
  status: 'Available' | 'Booked' | 'Sold';
  buyerId: mongoose.Types.ObjectId | null;
  bookedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UintSchema = new Schema<IUnit>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    unitNumber: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    areaSqft: { type: Number, required: true },
    price: { type: Number, required: true },
    pricePerSqft: { type: Number, required: true },
    images: { type: [String], default: [] },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Booked', 'Sold'],
      default: 'Available',
    },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    bookedDate: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Unit = mongoose.model<IUnit>('Units', UintSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  type: 'apartments' | 'condos' | 'plots' | 'bungalows' | 'townhouse';
  totalUnits: number;
  status: 'upcoming' | 'under construction' | 'complete' | 'completed';
  completion: string;
  location: {
    address?: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  priceRange?: { min: number; max: number };
  availableUnits: number;
  soldUnits: number;
  pincode: Number;
  assets: string;
  listingDate?: Number;
  listingUser: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['apartments', 'condos', 'plots', 'bungalows', 'townhouse'],
    },
    totalUnits: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['upcoming', 'under construction', 'complete', 'completed'],
    },
    completion: { type: String, default: '' },
    location: {
      state: { type: String, required: true },
      city: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    availableUnits: { type: Number, default: 0 },
    soldUnits: { type: Number, default: 0 },
    assets: { type: String, required: true },
    pincode: { type: Number, required: true },
    listingDate: { type: Number, default: () => Date.now() },
    listingUser: { type: String, required: true },
  },
  { timestamps: true },
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: String,
    role: { type: String, enum: ['BUYER', 'SELLER', 'ADMIN'], default: 'BUYER' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);

import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '@portfolio/types';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please add a password'],
      select: false, // Don't return by default
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.VIEWER,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

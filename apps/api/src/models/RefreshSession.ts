import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshSession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userAgent: String,
    ipAddress: String,
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically remove expired sessions
RefreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RefreshSession ||
  mongoose.model<IRefreshSession>('RefreshSession', RefreshSessionSchema);

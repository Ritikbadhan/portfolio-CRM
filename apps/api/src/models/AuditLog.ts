import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  USER_REGISTERED = 'USER_REGISTERED',
}

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: AuditAction;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
    },
    details: String,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

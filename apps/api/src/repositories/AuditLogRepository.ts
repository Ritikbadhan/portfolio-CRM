import AuditLog, { IAuditLog, AuditAction } from '../models/AuditLog';

export class AuditLogRepository {
  async logAction(data: {
    userId?: string;
    action: AuditAction;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IAuditLog> {
    return AuditLog.create(data);
  }
}

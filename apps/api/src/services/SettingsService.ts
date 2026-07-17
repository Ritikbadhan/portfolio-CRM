import { SettingsRepository } from '../repositories/SettingsRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { ISettings } from '../models/Settings';
import { AuditAction } from '../models/AuditLog';

export class SettingsService {
  private settingsRepo: SettingsRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.settingsRepo = new SettingsRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async getSettings(): Promise<ISettings> {
    // In the future, wrap this with Redis CacheService.get('settings')
    return await this.settingsRepo.getSettings();
  }

  async updateSettings(
    data: Partial<ISettings>,
    auditContext: { userId?: string; ipAddress?: string; userAgent?: string }
  ): Promise<ISettings> {
    const updated = await this.settingsRepo.updateSettings(data);

    // In the future, CacheService.set('settings', updated)

    await this.auditRepo.logAction({
      action: AuditAction.SETTINGS_UPDATED,
      userId: auditContext.userId,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
      details: `Settings partially updated: ${Object.keys(data).join(', ')}`,
    });

    return updated;
  }

  async resetSettings(auditContext: {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ISettings> {
    const reset = await this.settingsRepo.resetSettings();

    // In the future, CacheService.del('settings')

    await this.auditRepo.logAction({
      action: AuditAction.SETTINGS_UPDATED,
      userId: auditContext.userId,
      ipAddress: auditContext.ipAddress,
      userAgent: auditContext.userAgent,
      details: 'Global settings were reset to default',
    });

    return reset;
  }
}

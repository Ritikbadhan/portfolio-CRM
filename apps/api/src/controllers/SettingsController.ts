import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../utils/asyncHandler';

const settingsService = new SettingsService();

export class SettingsController {
  // Public GET returns safe values
  getPublicSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.getSettings();

    // Pick safe fields only
    const safePayload = {
      general: settings.general,
      branding: settings.branding,
      theme: settings.theme,
      social: settings.social,
      contact: settings.contact,
      seo: settings.seo,
      maintenance: settings.maintenance,
      analytics: settings.analytics,
      resume: settings.resume,
    };

    return successResponse(res, 200, 'Settings fetched successfully', safePayload);
  });

  // Admin GET returns everything
  getAdminSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.getSettings();
    return successResponse(res, 200, 'Admin settings fetched successfully', settings);
  });

  updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const auditContext = {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const updated = await settingsService.updateSettings(req.body, auditContext);
    return successResponse(res, 200, 'Settings updated successfully', updated);
  });

  resetSettings = asyncHandler(async (req: Request, res: Response) => {
    const auditContext = {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const reset = await settingsService.resetSettings(auditContext);
    return successResponse(res, 200, 'Settings reset successfully', reset);
  });

  // Mock Upload handlers that just return a mock URL
  uploadLogo = asyncHandler(async (req: Request, res: Response) => {
    const mockUrl = `https://res.cloudinary.com/demo/image/upload/logo_${Date.now()}.png`;

    // Get existing settings to not overwrite favicon
    const settings = await settingsService.getSettings();

    const updated = await settingsService.updateSettings(
      { branding: { ...settings.branding, logoUrl: mockUrl } },
      { userId: req.user?.id, ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    );

    return successResponse(res, 200, 'Logo uploaded successfully', updated.branding);
  });

  uploadFavicon = asyncHandler(async (req: Request, res: Response) => {
    const mockUrl = `https://res.cloudinary.com/demo/image/upload/favicon_${Date.now()}.ico`;

    const settings = await settingsService.getSettings();

    const updated = await settingsService.updateSettings(
      { branding: { ...settings.branding, faviconUrl: mockUrl } },
      { userId: req.user?.id, ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    );

    return successResponse(res, 200, 'Favicon uploaded successfully', updated.branding);
  });
}

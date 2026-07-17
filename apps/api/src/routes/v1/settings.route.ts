import { Router } from 'express';
import { SettingsController } from '../../controllers/SettingsController';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { Permission } from '@portfolio/types';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateSettingsSchema } from '../../validators/settings.validator';

const router = Router();
const controller = new SettingsController();

// Publicly accessible general settings
router.get('/', controller.getPublicSettings);

// All subsequent routes require authentication and SETTINGS_UPDATE permission
router.use(requireAuth);
router.use(requirePermission(Permission.SETTINGS_UPDATE));

// Admin full settings
router.get('/admin', controller.getAdminSettings);

// Full/Partial Updates using the same schema mapping
router.put('/', validateRequest(updateSettingsSchema), controller.updateSettings);
router.patch('/theme', validateRequest(updateSettingsSchema), controller.updateSettings);
router.patch('/social', validateRequest(updateSettingsSchema), controller.updateSettings);
router.patch('/contact', validateRequest(updateSettingsSchema), controller.updateSettings);
router.patch('/seo', validateRequest(updateSettingsSchema), controller.updateSettings);
router.patch('/branding', validateRequest(updateSettingsSchema), controller.updateSettings);

// Reset
router.post('/reset', controller.resetSettings);

// Mock Uploads
router.post('/upload/logo', controller.uploadLogo);
router.post('/upload/favicon', controller.uploadFavicon);

export default router;

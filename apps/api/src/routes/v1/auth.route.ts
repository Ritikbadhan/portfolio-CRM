import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', requireAuth, asyncHandler(authController.logout));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/reset-password/:token', asyncHandler(authController.resetPassword));
router.get('/me', requireAuth, asyncHandler(authController.getMe));
router.put('/me', requireAuth, asyncHandler(authController.updateProfile));
router.post('/change-password', requireAuth, asyncHandler(authController.changePassword));

export default router;

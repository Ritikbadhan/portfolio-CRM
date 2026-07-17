import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { UserRole, Permission } from '@portfolio/types';
import { successResponse } from '../../utils/response.util';

const router = Router();

// Protect ALL routes below with authentication and ADMIN role requirement
router.use(requireAuth);
router.use(requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

router.get('/dashboard', (req, res) => {
  res.status(200).json(
    successResponse('Welcome to the Admin Dashboard', {
      user: req.user,
    })
  );
});

// A route that requires a specific permission rather than just the Admin role
router.delete('/purge', requirePermission(Permission.PROJECTS_DELETE), (req, res) => {
  res.status(200).json(successResponse('Purge initiated successfully'));
});

export default router;

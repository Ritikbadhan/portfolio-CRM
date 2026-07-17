import { Request, Response, NextFunction } from 'express';
import { Permission, hasPermission } from '@portfolio/types';
import { AppError } from '../utils/AppError';

export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const isAuthorized = hasPermission(req.user.role, permission);

    if (!isAuthorized) {
      return next(new AppError(`Forbidden: Requires '${permission}' permission`, 403));
    }

    next();
  };
};

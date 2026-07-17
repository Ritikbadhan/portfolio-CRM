import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@portfolio/types';
import { AppError } from '../utils/AppError';

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient role clearance', 403));
    }

    next();
  };
};

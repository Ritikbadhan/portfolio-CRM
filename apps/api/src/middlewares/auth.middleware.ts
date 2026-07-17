import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { AppError } from '../utils/AppError';
import { UserRepository } from '../repositories/UserRepository';

import { IUser } from '../models/User';

const userRepo = new UserRepository();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = verifyAccessToken(token);
    const user = await userRepo.findById(decoded.userId);

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

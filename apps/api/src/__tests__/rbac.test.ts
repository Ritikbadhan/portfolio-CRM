import { Request, Response, NextFunction } from 'express';
import { requireRole } from '../middlewares/role.middleware';
import { requirePermission } from '../middlewares/permission.middleware';
import { UserRole, Permission } from '@portfolio/types';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';

describe('RBAC Middlewares', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('requireRole middleware', () => {
    it('should throw 401 if user is not authenticated', () => {
      const middleware = requireRole([UserRole.ADMIN]);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('should throw 403 if user role is not in allowed roles', () => {
      mockRequest.user = { role: UserRole.VIEWER } as unknown as IUser;
      const middleware = requireRole([UserRole.ADMIN, UserRole.EDITOR]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('should call next() if user has the correct role', () => {
      mockRequest.user = { role: UserRole.EDITOR } as unknown as IUser;
      const middleware = requireRole([UserRole.ADMIN, UserRole.EDITOR]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(); // Called with no arguments (success)
    });
  });

  describe('requirePermission middleware', () => {
    it('should throw 401 if user is not authenticated', () => {
      const middleware = requirePermission(Permission.PROJECTS_CREATE);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('should throw 403 if user lacks required permission', () => {
      mockRequest.user = { role: UserRole.VIEWER } as unknown as IUser;
      const middleware = requirePermission(Permission.PROJECTS_CREATE);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('should call next() if user role has the required permission', () => {
      mockRequest.user = { role: UserRole.EDITOR } as unknown as IUser;
      const middleware = requirePermission(Permission.PROJECTS_CREATE);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should inherently grant all permissions to SUPER_ADMIN', () => {
      mockRequest.user = { role: UserRole.SUPER_ADMIN } as unknown as IUser;
      const middleware = requirePermission(Permission.SETTINGS_UPDATE);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
    });
  });
});

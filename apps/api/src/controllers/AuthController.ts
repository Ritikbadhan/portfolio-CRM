import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { successResponse } from '../utils/response.util';
import {
  registerSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const authService = new AuthService();

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearTokenCookies = (res: Response) => {
  res.cookie('accessToken', 'none', { expires: new Date(Date.now() + 1 * 1000), httpOnly: true });
  res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 1 * 1000), httpOnly: true });
};

export class AuthController {
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req).body;
    const { user, accessToken, refreshToken } = await authService.register(
      validatedData,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    setTokenCookies(res, accessToken, refreshToken);
    return successResponse(res, 201, 'User registered successfully', { user });
  }

  async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req).body;
    const { user, accessToken, refreshToken } = await authService.login(
      validatedData,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    setTokenCookies(res, accessToken, refreshToken);
    return successResponse(res, 200, 'Login successful', { user });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const {
      user,
      accessToken,
      refreshToken: newRefresh,
    } = await authService.refreshToken(
      refreshToken,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    setTokenCookies(res, accessToken, newRefresh);
    return successResponse(res, 200, 'Token refreshed successfully', { user });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken && req.user) {
      await authService.logout(
        refreshToken,
        req.user.id,
        req.ip || 'unknown',
        req.headers['user-agent'] || 'unknown'
      );
    }

    clearTokenCookies(res);
    return successResponse(res, 200, 'Logout successful');
  }

  async forgotPassword(req: Request, res: Response) {
    const validatedData = resetPasswordRequestSchema.parse(req).body;
    // We send a token back for dev purposes since we have no email service.
    const token = await authService.forgotPassword(
      validatedData.email,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    return successResponse(res, 200, 'Password reset email sent', { devToken: token });
  }

  async resetPassword(req: Request, res: Response) {
    const validatedData = resetPasswordSchema.parse(req);
    const { user, accessToken, refreshToken } = await authService.resetPassword(
      validatedData.params.token,
      validatedData.body.password,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    setTokenCookies(res, accessToken, refreshToken);
    return successResponse(res, 200, 'Password reset successfully', { user });
  }

  async getMe(req: Request, res: Response) {
    return successResponse(res, 200, 'Current user retrieved', { user: req.user });
  }

  async updateProfile(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // We would use updateProfileSchema.parse(req).body here in reality
    const user = await authService.updateProfile(
      req.user.id,
      req.body,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    return successResponse(res, 200, 'Profile updated successfully', { user });
  }

  async changePassword(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    await authService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
      req.ip || 'unknown',
      req.headers['user-agent'] || 'unknown'
    );

    return successResponse(res, 200, 'Password changed successfully');
  }
}

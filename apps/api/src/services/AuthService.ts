import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshSessionRepository } from '../repositories/RefreshSessionRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { AuditAction } from '../models/AuditLog';
import { logger } from '../config/logger';

export class AuthService {
  private userRepo: UserRepository;
  private sessionRepo: RefreshSessionRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.sessionRepo = new RefreshSessionRepository();
    this.auditRepo = new AuditLogRepository();
  }

  async register(data: Record<string, string>, ip: string, userAgent: string) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await hashPassword(data.password);
    const user = await this.userRepo.create({ ...data, passwordHash });

    await this.auditRepo.logAction({
      userId: user.id,
      action: AuditAction.USER_REGISTERED,
      ipAddress: ip,
      userAgent,
    });

    return this.generateAuthTokens(user, ip, userAgent);
  }

  async login(data: Record<string, string>, ip: string, userAgent: string) {
    const user = await this.userRepo.findByEmail(data.email, true);
    if (!user) {
      await this.auditRepo.logAction({
        action: AuditAction.LOGIN_FAILED,
        details: `Email: ${data.email}`,
        ipAddress: ip,
        userAgent,
      });
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      await this.auditRepo.logAction({
        userId: user.id,
        action: AuditAction.LOGIN_FAILED,
        ipAddress: ip,
        userAgent,
      });
      throw new AppError('Invalid credentials', 401);
    }

    await this.auditRepo.logAction({
      userId: user.id,
      action: AuditAction.LOGIN_SUCCESS,
      ipAddress: ip,
      userAgent,
    });

    return this.generateAuthTokens(user, ip, userAgent);
  }

  async refreshToken(token: string, ip: string, userAgent: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const session = await this.sessionRepo.findByToken(token);

      if (!session) {
        throw new AppError('Session invalid or revoked', 401);
      }

      // Revoke old token
      await this.sessionRepo.revokeToken(token);

      const user = await this.userRepo.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      await this.auditRepo.logAction({
        userId: user.id,
        action: AuditAction.TOKEN_REFRESH,
        ipAddress: ip,
        userAgent,
      });

      return this.generateAuthTokens(user, ip, userAgent);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(token: string, userId: string, ip: string, userAgent: string) {
    await this.sessionRepo.revokeToken(token);
    await this.auditRepo.logAction({
      userId,
      action: AuditAction.LOGOUT,
      ipAddress: ip,
      userAgent,
    });
  }

  async forgotPassword(email: string, ip: string, userAgent: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Don't leak whether user exists
      return;
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.userRepo.update(user.id, { resetPasswordToken, resetPasswordExpire });
    await this.auditRepo.logAction({
      userId: user.id,
      action: AuditAction.PASSWORD_RESET_REQUEST,
      ipAddress: ip,
      userAgent,
    });

    // TODO: Send email. For now, log the token.
    logger.info(`Reset token for ${email}: ${resetToken}`);
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string, ip: string, userAgent: string) {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.userRepo.findByResetToken(resetPasswordToken);

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const passwordHash = await hashPassword(newPassword);

    // Revoke all sessions since password changed
    await this.sessionRepo.revokeAllUserSessions(user.id);
    await this.userRepo.update(user.id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined,
    });

    await this.auditRepo.logAction({
      userId: user.id,
      action: AuditAction.PASSWORD_RESET_SUCCESS,
      ipAddress: ip,
      userAgent,
    });

    return this.generateAuthTokens(user, ip, userAgent);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateProfile(userId: string, data: Record<string, any>, ip: string, userAgent: string) {
    const user = await this.userRepo.update(userId, data);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.auditRepo.logAction({
      userId,
      action: AuditAction.PROFILE_UPDATED,
      ipAddress: ip,
      userAgent,
    });
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ip: string,
    userAgent: string
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const fullUser = await this.userRepo.findByEmail(user.email, true);
    if (!fullUser) throw new AppError('User not found', 404);

    const isMatch = await comparePassword(currentPassword, fullUser.passwordHash);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    const passwordHash = await hashPassword(newPassword);
    await this.userRepo.update(userId, { passwordHash });
    await this.sessionRepo.revokeAllUserSessions(userId);
    await this.auditRepo.logAction({
      userId,
      action: AuditAction.PASSWORD_CHANGED,
      ipAddress: ip,
      userAgent,
    });
  }

  private async generateAuthTokens(
    user: import('../models/User').IUser,
    ip: string,
    userAgent: string
  ) {
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.sessionRepo.createSession({
      userId: user.id,
      token: refreshToken,
      ipAddress: ip,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { user, accessToken, refreshToken };
  }
}

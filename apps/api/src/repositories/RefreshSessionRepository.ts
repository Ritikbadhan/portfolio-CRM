import RefreshSession, { IRefreshSession } from '../models/RefreshSession';

export class RefreshSessionRepository {
  async createSession(data: Partial<IRefreshSession>): Promise<IRefreshSession> {
    return RefreshSession.create(data);
  }

  async findByToken(token: string): Promise<IRefreshSession | null> {
    return RefreshSession.findOne({ token, isRevoked: false });
  }

  async revokeToken(token: string): Promise<void> {
    await RefreshSession.updateOne({ token }, { isRevoked: true });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await RefreshSession.updateMany({ userId }, { isRevoked: true });
  }
}

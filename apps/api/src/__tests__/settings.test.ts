import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { UserRole } from '@portfolio/types';
import { generateAccessToken } from '../utils/jwt.util';
import { Settings } from '../models/Settings';
import AuditLog from '../models/AuditLog';
import User from '../models/User';

describe('Settings API', () => {
  let adminToken: string;
  let viewerToken: string;
  let adminId: string;
  let viewerId: string;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-test-settings'
    );
    await User.deleteMany({});

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin.settings@test.com',
      passwordHash: 'Password123!',
      role: UserRole.ADMIN,
    });
    adminId = admin._id.toString();
    adminToken = generateAccessToken({ userId: adminId, role: UserRole.ADMIN });

    const viewer = await User.create({
      name: 'Viewer User',
      email: 'viewer.settings@test.com',
      passwordHash: 'Password123!',
      role: UserRole.VIEWER,
    });
    viewerId = viewer._id.toString();
    viewerToken = generateAccessToken({ userId: viewerId, role: UserRole.VIEWER });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Settings.deleteMany({});
    await AuditLog.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Settings.deleteMany({});
    await AuditLog.deleteMany({});
  });

  describe('GET /api/v1/settings', () => {
    it('should return public settings successfully without authentication', async () => {
      // Seed initial setting
      await Settings.create({ general: { siteName: 'Test Portfolio' } });

      const res = await request(app).get('/api/v1/settings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.general.siteName).toBe('Test Portfolio');

      // Ensure sensitive placeholders are not returned
      expect(res.body.data.smtp).toBeUndefined();
      expect(res.body.data.cloudinary).toBeUndefined();
      expect(res.body.data.redis).toBeUndefined();
    });
  });

  describe('GET /api/v1/settings/admin', () => {
    it('should throw 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/v1/settings/admin');
      expect(res.status).toBe(401);
    });

    it('should throw 403 if user lacks SETTINGS_UPDATE permission', async () => {
      const res = await request(app)
        .get('/api/v1/settings/admin')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(res.status).toBe(403);
    });

    it('should return full settings if user is ADMIN', async () => {
      await Settings.create({
        general: { siteName: 'Test Portfolio' },
        smtp: { host: 'smtp.mailtrap.io' },
      });

      const res = await request(app)
        .get('/api/v1/settings/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.smtp).toBeDefined();
      expect(res.body.data.smtp.host).toBe('smtp.mailtrap.io');
    });
  });

  describe('PUT /api/v1/settings', () => {
    it('should update settings and create an audit log', async () => {
      const res = await request(app)
        .put('/api/v1/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          general: { siteName: 'Updated Portfolio', siteDescription: 'New desc' },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.general.siteName).toBe('Updated Portfolio');

      // Check DB
      const dbSettings = await Settings.findOne();
      expect(dbSettings?.general.siteName).toBe('Updated Portfolio');

      // Check Audit Log
      const audit = await AuditLog.findOne();
      expect(audit).toBeDefined();
      expect(audit?.action).toBe('SETTINGS_UPDATED');
      expect(audit?.userId?.toString()).toBe(adminId);
    });

    it('should validate inputs', async () => {
      const res = await request(app)
        .put('/api/v1/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          contact: { email: 'not-an-email' },
        });

      expect(res.status).toBe(400); // Zod validation fails
    });
  });

  describe('PATCH /api/v1/settings/theme', () => {
    it('should partially update theme', async () => {
      await Settings.create({ theme: { mode: 'light', primaryColor: '#000' } });

      const res = await request(app)
        .patch('/api/v1/settings/theme')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          theme: { mode: 'dark' },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.theme.mode).toBe('dark');
    });
  });

  describe('POST /api/v1/settings/reset', () => {
    it('should reset settings to default', async () => {
      await Settings.create({ general: { siteName: 'Hacked Site' } });

      const res = await request(app)
        .post('/api/v1/settings/reset')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.general.siteName).toBe('My Portfolio'); // The default
    });
  });
});

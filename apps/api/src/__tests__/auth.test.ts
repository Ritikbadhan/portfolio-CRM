import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';

describe('Auth Integration Tests', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Connect to test db if not already handled globally
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-test-auth'
    );
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();

    // Extract tokens from cookies for later tests
    const accessCookie = cookies.find((c: string) => c.startsWith('accessToken='));
    const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));

    accessToken = accessCookie.split(';')[0].split('=')[1];
    refreshToken = refreshCookie.split(';')[0].split('=')[1];
  });

  it('should get current user profile using JWT', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should logout and clear cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

    expect(res.status).toBe(200);
    const cookies = res.headers['set-cookie'];

    const accessCookie = cookies.find((c: string) => c.startsWith('accessToken=none'));
    expect(accessCookie).toBeDefined(); // Verifies it was cleared
  });
});

import request from 'supertest';
import app from '../app';

describe('Express Application', () => {
  it('GET /api/v1/health should return 200 OK', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('API is running');
  });
});

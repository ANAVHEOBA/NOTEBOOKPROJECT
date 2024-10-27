import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('App Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 for the root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toBe('App is live!');
  });

  it('should rate limit login attempts', async () => {
    for (let i = 0; i < 6; i++) {
      await request(app).post('/api/users/login').send({ username: 'test', password: 'wrong' });
    }
    const response = await request(app).post('/api/users/login').send({ username: 'test', password: 'wrong' });
    expect(response.status).toBe(429);
  });

  // More tests for users and notes routes here...
});

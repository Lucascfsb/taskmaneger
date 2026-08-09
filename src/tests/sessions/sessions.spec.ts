import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../database/prisma';

describe('SessionsController', () => {
  let user_id: string;
  const testEmail = `jane.${Date.now()}@example.com`;

  afterAll(async () => {
    if (user_id) {
      await prisma.user.delete({ where: { id: user_id } });
    }
  });

  it('should authenticate a user and get access token', async () => {
    const userResponse = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: testEmail,
      password: 'password123',
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post('/sessions').send({
      email: testEmail,
      password: 'password123',
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../database/prisma';
import bcrypt from 'bcryptjs';

describe('E2E: Teams', () => {
  let token: string;
  const testEmail = `team_test_${Date.now()}@email.com`;

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: testEmail,
        password: await bcrypt.hash('password123', 8),
        role: 'ADMIN',
      },
    });

    const authResponse = await request(app).post('/sessions').send({
      email: testEmail,
      password: 'password123',
    });

    token = authResponse.body.token;
  });

  afterAll(async () => {
    await prisma.team.deleteMany({ where: { name: 'Backend Devs' } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('should create a new team', async () => {
    const response = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Backend Devs',
        description: 'Time de desenvolvimento backend',
      });

    if (response.status === 400) console.log('Erro no Team:', response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Backend Devs');
  });

  it('should list the registered teams', async () => {
    const response = await request(app)
      .get('/teams')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should not allow creating a team without sending the name (Zod validation)', async () => {
    const response = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });
});

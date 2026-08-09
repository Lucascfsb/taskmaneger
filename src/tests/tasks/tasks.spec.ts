import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../database/prisma';
import bcrypt from 'bcryptjs';

describe('E2E: Tasks & History', () => {
  let token: string;
  let teamId: string;
  let taskId: string;
  const testEmail = `task_test_${Date.now()}@email.com`;

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: 'Task Tester',
        email: testEmail,
        password: await bcrypt.hash('password123', 8),
        role: 'ADMIN',
      },
    });

    const team = await prisma.team.create({
      data: {
        name: 'Task Dev Team',
        description: 'Time para os testes de tarefas',
      },
    });
    teamId = team.id;

    const authResponse = await request(app).post('/sessions').send({
      email: testEmail,
      password: 'password123',
    });

    token = authResponse.body.token;
  });

  afterAll(async () => {
    await prisma.taskHistory.deleteMany();
    await prisma.task.deleteMany();
    await prisma.team.deleteMany({ where: { id: teamId } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('should create a new task and update its status, registering history', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tarefa de Teste',
        description: 'Descrição do teste E2E',
        teamId: teamId,
      });

    if (createResponse.status === 400) {
      console.log('Erro na Task:', createResponse.body);
    }

    expect(createResponse.status).toBe(201);
    taskId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });

    expect(updateResponse.status).toBe(200);

    const historyResponse = await request(app)
      .get(`/tasks/${taskId}/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body.length).toBeGreaterThan(0);
    expect(historyResponse.body[0].newStatus).toBe('IN_PROGRESS');
  });
});

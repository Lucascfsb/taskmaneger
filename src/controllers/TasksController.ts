import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTaskService } from '../services/tasks/CreateTaskService';
import { ListTasksService } from '../services/tasks/ListTasksService';
import { UpdateTaskService } from '../services/tasks/UpdateTaskService';
import { DeleteTaskService } from '../services/tasks/DeleteTaskService';
import { AssignTaskService } from '../services/tasks/AssignTaskService';
import { GetTaskHistoryService } from '../services/tasks/GetTaskHistoryService';
import { Priority, TaskStatus } from '../generated/prisma/enums';
import { AppError } from '@/utils/AppError';

export class TasksController {
  async create(request: Request, response: Response) {
    const createTaskBodySchema = z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      teamId: z.uuid('Invalid team ID'),
      priority: z.enum(Priority).optional(),
      status: z.enum(TaskStatus).optional(),
      assignedTo: z.uuid().optional(),
    });

    const data = createTaskBodySchema.parse(request.body);

    const createTaskService = new CreateTaskService();
    const task = await createTaskService.execute(data);

    return response.status(201).json(task);
  }

  async list(request: Request, response: Response) {
    const listTasksQuerySchema = z.object({
      status: z.enum(TaskStatus).optional(),
      priority: z.enum(Priority).optional(),
      teamId: z.uuid().optional(),
    });

    const { status, priority, teamId } = listTasksQuerySchema.parse(
      request.query
    );

    if (!request.user) {
      throw new AppError('Unauthorized', 401);
    }

    const listTasksService = new ListTasksService();
    const tasks = await listTasksService.execute({
      status,
      priority,
      teamId,
      userId: request.user.id,
      userRole: request.user.role,
    });

    return response.json(tasks);
  }

  async update(request: Request, response: Response) {
    const updateTaskParamsSchema = z.object({
      id: z.uuid('Invalid task ID'),
    });

    const updateTaskBodySchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.enum(TaskStatus).optional(),
      priority: z.enum(Priority).optional(),
      assignedTo: z.uuid().optional(),
    });

    const { id: taskId } = updateTaskParamsSchema.parse(request.params);
    const data = updateTaskBodySchema.parse(request.body);

    if (!request.user) {
      throw new AppError('Unauthorized', 401);
    }

    const userId = request.user.id;
    const userRole = request.user.role;

    const updateTaskService = new UpdateTaskService();
    const task = await updateTaskService.execute({
      taskId,
      userId,
      userRole,
      ...data,
    });

    return response.json(task);
  }

  async delete(request: Request, response: Response) {
    const deleteTaskParamsSchema = z.object({
      id: z.uuid('Invalid task ID'),
    });

    const { id: taskId } = deleteTaskParamsSchema.parse(request.params);

    if (!request.user) {
      throw new AppError('Unauthorized', 401);
    }

    const deleteTaskService = new DeleteTaskService();
    await deleteTaskService.execute({
      taskId,
      userId: request.user.id,
      userRole: request.user.role,
    });
    return response.status(204).send();
  }

  async assign(request: Request, response: Response) {
    const assignTaskParamsSchema = z.object({
      id: z.uuid('Invalid task ID'),
    });

    const assignTaskBodySchema = z.object({
      userId: z.uuid('Invalid user ID'),
    });

    const { id: taskId } = assignTaskParamsSchema.parse(request.params);
    const { userId } = assignTaskBodySchema.parse(request.body);

    const assignTaskService = new AssignTaskService();
    const task = await assignTaskService.execute({ taskId, userId });

    return response.json(task);
  }

  async getHistory(request: Request, response: Response) {
    const getTaskHistoryParamsSchema = z.object({
      id: z.string().uuid('Invalid task ID'),
    });

    const { id: taskId } = getTaskHistoryParamsSchema.parse(request.params);

    if (!request.user) {
      throw new AppError('Unauthorized', 401);
    }

    const getTaskHistoryService = new GetTaskHistoryService();
    const history = await getTaskHistoryService.execute({
      taskId,
      userId: request.user.id,
      userRole: request.user.role,
    });

    return response.json(history);
  }
}

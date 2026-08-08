import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';
import { Priority, TaskStatus } from '../../generated/prisma/enums';

interface UpdateTaskRequest {
  taskId: string;
  userId: string;
  userRole: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignedTo?: string;
}

export class UpdateTaskService {
  async execute({
    taskId,
    userId,
    userRole,
    title,
    description,
    status,
    priority,
    assignedTo,
  }: UpdateTaskRequest) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    if (userRole === 'MEMBER' && task.assignedTo !== userId) {
      throw new AppError('You do not have permission to manage this task', 403);
    }

    if (status && status !== task.status) {
      await prisma.taskHistory.create({
        data: {
          taskId,
          changedBy: userId,
          oldStatus: task.status,
          newStatus: status,
        },
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        priority,
        assignedTo,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
    });

    return updatedTask;
  }
}

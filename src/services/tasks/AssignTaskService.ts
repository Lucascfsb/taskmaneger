import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface AssignTaskRequest {
  taskId: string;
  userId: string;
}

export class AssignTaskService {
  async execute({ taskId, userId }: AssignTaskRequest) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedTo: userId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updatedTask;
  }
}

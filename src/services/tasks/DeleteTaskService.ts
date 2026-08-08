import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface DeleteTaskRequest {
  taskId: string;
  userId: string;
  userRole: string;
}

export class DeleteTaskService {
  async execute({ taskId, userId, userRole }: DeleteTaskRequest) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    if (userRole === 'MEMBER' && task.assignedTo !== userId) {
      throw new AppError('You do not have permission to delete this task', 403);
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

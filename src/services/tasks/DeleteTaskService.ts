import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface DeleteTaskRequest {
  taskId: string;
}

export class DeleteTaskService {
  async execute({ taskId }: DeleteTaskRequest) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

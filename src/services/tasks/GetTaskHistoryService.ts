import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface GetTaskHistoryRequest {
  taskId: string;
  userId: string;
  userRole: string;
}

export class GetTaskHistoryService {
  async execute({ taskId, userId, userRole }: GetTaskHistoryRequest) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    if (userRole === 'MEMBER' && task.assignedTo !== userId) {
      throw new AppError(
        'You do not have permission to view history for this task.',
        403
      );
    }

    const history = await prisma.taskHistory.findMany({
      where: { taskId },
      orderBy: {
        changedAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return history;
  }
}

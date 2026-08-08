import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';
import { Priority, TaskStatus } from '../../generated/prisma/enums';

interface CreateTaskRequest {
  title: string;
  description?: string;
  teamId: string;
  priority?: Priority;
  status?: TaskStatus;
  assignedTo?: string;
}

export class CreateTaskService {
  async execute({
    title,
    description,
    teamId,
    priority,
    status,
    assignedTo,
  }: CreateTaskRequest) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError('Team not found.', 404);
    }

    if (assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: assignedTo },
      });

      if (!user) {
        throw new AppError('Assigned user not found.', 404);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        teamId,
        priority,
        status,
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

    return task;
  }
}

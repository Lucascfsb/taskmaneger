import { prisma } from '../../database/prisma';
import { Priority, TaskStatus } from '../../generated/prisma/enums';

interface ListTasksRequest {
  status?: TaskStatus;
  priority?: Priority;
  teamId?: string;
}

export class ListTasksService {
  async execute({ status, priority, teamId }: ListTasksRequest) {
    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(teamId && { teamId }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }
}

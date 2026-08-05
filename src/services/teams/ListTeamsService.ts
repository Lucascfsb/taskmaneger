import { prisma } from '../../database/prisma';

export class ListTeamsService {
  async execute() {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: { members: true, tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return teams;
  }
}

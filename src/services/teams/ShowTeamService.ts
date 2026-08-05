import { prisma } from '../../database/prisma';

interface ShowTeamRequest {
  id: string;
}

export class ShowTeamService {
  async execute({ id }: ShowTeamRequest) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }
}

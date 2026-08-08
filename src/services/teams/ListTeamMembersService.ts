import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface ListTeamMembersRequest {
  teamId: string;
}

export class ListTeamMembersService {
  async execute({ teamId }: ListTeamMembersRequest) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError('Team not found.', 404);
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return members;
  }
}

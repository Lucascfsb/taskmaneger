import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface AddTeamMemberRequest {
  teamId: string;
  userId: string;
}

export class AddTeamMemberService {
  async execute({ teamId, userId }: AddTeamMemberRequest) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError('Team not found.', 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const memberAlreadyExists = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (memberAlreadyExists) {
      throw new AppError('User is already a member of this team.', 400);
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return teamMember;
  }
}

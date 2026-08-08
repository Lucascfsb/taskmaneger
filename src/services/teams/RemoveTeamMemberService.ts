import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface RemoveTeamMemberRequest {
  teamId: string;
  userId: string;
}

export class RemoveTeamMemberService {
  async execute({ teamId, userId }: RemoveTeamMemberRequest) {
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new AppError('Member not found in this team.', 404);
    }

    await prisma.teamMember.delete({
      where: {
        id: teamMember.id,
      },
    });
  }
}

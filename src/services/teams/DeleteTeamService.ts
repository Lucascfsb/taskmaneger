import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface DeleteTeamRequest {
  id: string;
}

export class DeleteTeamService {
  async execute({ id }: DeleteTeamRequest) {
    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new AppError('Team not found.', 404);
    }

    await prisma.team.delete({
      where: { id },
    });
  }
}

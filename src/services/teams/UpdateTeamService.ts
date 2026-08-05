import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface UpdateTeamRequest {
  id: string;
  name?: string;
  description?: string;
}

export class UpdateTeamService {
  async execute({ id, name, description }: UpdateTeamRequest) {
    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new AppError('Team not found.', 404);
    }

    if (name && name !== team.name) {
      const teamWithSameName = await prisma.team.findFirst({
        where: { name },
      });

      if (teamWithSameName) {
        throw new AppError('A team with this name already exists.', 400);
      }
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return updatedTeam;
  }
}

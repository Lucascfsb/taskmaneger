import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface CreateTeamRequest {
  name: string;
  description?: string;
}

export class CreateTeamService {
  async execute({ name, description }: CreateTeamRequest) {
    const teamAlreadyExists = await prisma.team.findFirst({
      where: { name },
    });

    if (teamAlreadyExists) {
      throw new AppError('A team with this name already exists.', 400);
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return team;
  }
}

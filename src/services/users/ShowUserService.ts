import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface ShowUserRequest {
  id: string;
}

export class ShowUserService {
  async execute({ id }: ShowUserRequest) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

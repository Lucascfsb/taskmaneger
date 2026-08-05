import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface DeleteUserRequest {
  id: string;
}

export class DeleteUserService {
  async execute({ id }: DeleteUserRequest) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}

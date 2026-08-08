import { Role } from '@/generated/prisma/browser';
import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface DeleteUserRequest {
  id: string;
  userId: string;
  userRole: Role;
}

export class DeleteUserService {
  async execute({ id, userId, userRole }: DeleteUserRequest) {
    if (userRole !== Role.ADMIN && userId !== id) {
      throw new AppError('Unauthorized access to this resource.', 403);
    }

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

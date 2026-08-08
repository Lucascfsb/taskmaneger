import { compare, hash } from 'bcryptjs';
import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';
import { Role } from '@/generated/prisma/enums';

interface UpdateUserRequest {
  id: string;
  userId: string;
  userRole: Role;
  name?: string;
  email?: string;
  password?: string;
  old_password?: string;
}

export class UpdateUserService {
  async execute({
    id,
    userId,
    userRole,
    name,
    email,
    password,
    old_password,
  }: UpdateUserRequest) {
    if (userRole !== Role.ADMIN && userId !== id) {
      throw new AppError('Unauthorized access to this resource.', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email && email !== user.email) {
      const userWithUpdatedEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithUpdatedEmail) {
        throw new AppError('E-mail already in use', 400);
      }

      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
        400
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match', 400);
      }

      user.password = await hash(password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }
}

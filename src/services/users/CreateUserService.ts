import { hash } from 'bcryptjs';
import { prisma } from '../../database/prisma';
import { AppError } from '../../utils/AppError';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MEMBER';
}

export class CreateUserService {
  async execute({ name, email, password, role }: CreateUserRequest) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role ?? 'MEMBER',
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

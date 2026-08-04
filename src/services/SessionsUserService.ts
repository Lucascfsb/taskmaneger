import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '../database/prisma';
import { env } from '../env';
import { AppError } from '../utils/AppError';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthenticateUserService {
  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const token = sign({ role: user.role }, env.JWT_SECRET, {
      subject: String(user.id),
      expiresIn: '1d',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

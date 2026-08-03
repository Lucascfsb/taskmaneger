import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../database/prisma';
import { env } from '../env';

const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
  email: z.email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
});

const loginSchema = z.object({
  email: z.email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export class AuthController {
  // POST /auth/register
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  }

  // POST /auth/login
  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { role: user.role },
      env.JWT_SECRET,
      {
        subject: String(user.id),
        expiresIn: '1d',
      }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  }
}
import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateUserService } from '../services/CreateUserService';
import { AuthenticateUserService } from '../services/SessionsUserService';

export class AuthController {
  // POST /auth/register
  async register(req: Request, res: Response) {
    const registerSchema = z.object({
      name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
      email: z.email('E-mail inválido.'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
      role: z.enum(['ADMIN', 'MEMBER']).optional(),
    });

    const { name, email, password, role } = registerSchema.parse(req.body);

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json(user);
  }

  // POST /auth/login
  async login(req: Request, res: Response) {
    const loginSchema = z.object({
      email: z.email('E-mail inválido.'),
      password: z.string().min(1, 'A senha é obrigatória.'),
    });

    const { email, password } = loginSchema.parse(req.body);

    const authenticateUserService = new AuthenticateUserService();

    const result = await authenticateUserService.execute({
      email,
      password,
    });

    return res.json(result);
  }
}

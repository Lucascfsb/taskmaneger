import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateUserService } from '../services/CreateUserService';
import { ListUsersService } from '../services/ListUsersService';

export class UsersController {
  async create(request: Request, response: Response) {
    const createUserBodySchema = z.object({
      name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
      email: z.email('E-mail inválido'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
      role: z.enum(['ADMIN', 'MEMBER']).optional(),
    });

    const { name, email, password, role } = createUserBodySchema.parse(
      request.body
    );

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password,
      role,
    });

    return response.status(201).json(user);
  }
}

export class ListUsersController {
  async list(_req: Request, res: Response) {
    const listUsersService = new ListUsersService();

    const users = await listUsersService.execute();

    return res.json(users);
  }
}

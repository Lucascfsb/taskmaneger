import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateUserService } from '../services/CreateUserService';
import { ListUsersService } from '../services/users/ListUsersService';
import { ShowUserService } from '../services/ShowUserService';
import { UpdateUserService } from '../services/UpdateUserService';
import { DeleteUserService } from '../services/DeleteUserService';

export class UsersController {
  async create(request: Request, response: Response) {
    const createUserBodySchema = z.object({
      name: z.string().min(2, 'The name must have at least 2 characters.'),
      email: z.email('Invalid email'),
      password: z
        .string()
        .min(6, 'The password must have at least 6 characters'),
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

export class ShowUserController {
  async show(request: Request, response: Response) {
    const showUserParamsSchema = z.object({
      id: z.uuid('ID inválido'),
    });

    const { id } = showUserParamsSchema.parse(request.params);

    const showUserService = new ShowUserService();

    const user = await showUserService.execute({ id });

    return response.json(user);
  }
}

export class UpdateUserController {
  async update(request: Request, response: Response) {
    const updateUserParamsSchema = z.object({
      id: z.uuid('ID inválido'),
    });

    const updateUserBodySchema = z.object({
      name: z
        .string()
        .min(2, 'The name must have at least 2 characters')
        .optional(),
      email: z.email('Invalid email').optional(),
      password: z
        .string()
        .min(6, 'The password must have at least 6 characters')
        .optional(),
      old_password: z.string().optional(),
    });

    const { id } = updateUserParamsSchema.parse(request.params);
    const { name, email, password, old_password } = updateUserBodySchema.parse(
      request.body
    );

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(user);
  }
}

export class DeleteUserController {
  async delete(request: Request, response: Response) {
    const deleteUserParamsSchema = z.object({
      id: z.uuid('ID inválido'),
    });

    const { id } = deleteUserParamsSchema.parse(request.params);

    const deleteUserService = new DeleteUserService();

    await deleteUserService.execute({ id });

    return response.status(204).send();
  }
}

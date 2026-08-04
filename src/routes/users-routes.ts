import { Router } from 'express';
import {
  UsersController,
  ListUsersController,
} from '../controllers/UsersController';

const usersRoutes = Router();
const usersController = new UsersController();
const listUsersController = new ListUsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.get('/', listUsersController.handle);

export { usersRoutes };

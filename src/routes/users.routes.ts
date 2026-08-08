import { Router } from 'express';
import {
  UsersController,
  ListUsersController,
  ShowUserController,
  UpdateUserController,
  DeleteUserController,
} from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { verifyUserRole } from '@/middlewares/verifyUserRole';

const usersRoutes = Router();

const usersController = new UsersController();
const listUsersController = new ListUsersController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

usersRoutes.post('/', usersController.create);

usersRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserRole('ADMIN'),
  listUsersController.list
);
usersRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserRole('ADMIN'),
  deleteUserController.delete
);

usersRoutes.get('/:id', ensureAuthenticated, showUserController.show);
usersRoutes.put('/:id', ensureAuthenticated, updateUserController.update);

export { usersRoutes };

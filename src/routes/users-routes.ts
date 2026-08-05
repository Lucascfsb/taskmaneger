import { Router } from 'express';
import {
  UsersController,
  ListUsersController,
  ShowUserController,
  UpdateUserController,
  DeleteUserController,
} from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const usersRoutes = Router();

const usersController = new UsersController();
const listUsersController = new ListUsersController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

usersRoutes.post('/', usersController.create);

usersRoutes.get('/', ensureAuthenticated, listUsersController.list);
usersRoutes.get('/:id', ensureAuthenticated, showUserController.show);
usersRoutes.put('/:id', ensureAuthenticated, updateUserController.update);
usersRoutes.delete('/:id', ensureAuthenticated, deleteUserController.delete);

export { usersRoutes };

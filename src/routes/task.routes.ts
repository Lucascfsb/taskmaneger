import { Router } from 'express';
import { TasksController } from '../controllers/TasksController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { verifyUserRole } from '../middlewares/verifyUserRole';

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);

tasksRoutes.get('/', tasksController.list);

tasksRoutes.post('/', verifyUserRole('ADMIN'), tasksController.create);
tasksRoutes.delete('/:id', verifyUserRole('ADMIN'), tasksController.delete);

tasksRoutes.put('/:id', tasksController.update);
tasksRoutes.patch('/:id/assign', tasksController.assign);

export { tasksRoutes };

import { Router } from 'express';
import { TeamsController } from '../controllers/TeamsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { verifyUserRole } from '../middlewares/verifyUserRole';

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated);

teamsRoutes.get('/', teamsController.list);
teamsRoutes.get('/:id', teamsController.show);

teamsRoutes.post('/', verifyUserRole('ADMIN'), teamsController.create);
teamsRoutes.put('/:id', verifyUserRole('ADMIN'), teamsController.update);
teamsRoutes.delete('/:id', verifyUserRole('ADMIN'), teamsController.delete);

teamsRoutes.post(
  '/:id/members',
  verifyUserRole('ADMIN'),
  teamsController.create
);
teamsRoutes.delete(
  '/:id/members/:userId',
  verifyUserRole('ADMIN'),
  teamsController.delete
);

export { teamsRoutes };

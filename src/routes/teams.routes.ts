import { Router } from 'express';
import { TeamsController } from '../controllers/TeamsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { verifyUserRole } from '../middlewares/verifyUserRole';

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated);

teamsRoutes.get('/', teamsController.list);
teamsRoutes.get('/:id', teamsController.show);
teamsRoutes.get('/:id/members', teamsController.listMembers);

teamsRoutes.post('/', verifyUserRole('ADMIN'), teamsController.create);
teamsRoutes.put('/:id', verifyUserRole('ADMIN'), teamsController.update);
teamsRoutes.delete('/:id', verifyUserRole('ADMIN'), teamsController.delete);

teamsRoutes.post(
  '/:id/members',
  verifyUserRole('ADMIN'),
  teamsController.addMember
);
teamsRoutes.delete(
  '/:id/members/:userId',
  verifyUserRole('ADMIN'),
  teamsController.removeMember
);

export { teamsRoutes };

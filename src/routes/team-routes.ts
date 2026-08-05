// import { Router } from 'express';
// import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
// import { verifyUserRole } from '@/middlewares/verifyUserRole';

// const teamsRoutes = Router();

// // teams-routes.ts
// teamsRoutes.use(ensureAuthenticated); // Aplica autenticação para todas as rotas de time

// teamsRoutes.get('/', teamsController.index); // ADMIN e MEMBER
// teamsRoutes.get('/:id', teamsController.show); // ADMIN e MEMBER

// // Rotas restritas apenas para ADMIN
// teamsRoutes.post('/', verifyUserRole('ADMIN'), teamsController.create);
// teamsRoutes.put('/:id', verifyUserRole('ADMIN'), teamsController.update);
// teamsRoutes.delete('/:id', verifyUserRole('ADMIN'), teamsController.delete);

// // Gerenciamento de membros do time
// teamsRoutes.post(
//   '/:id/members',
//   verifyUserRole('ADMIN'),
//   teamMembersController.create
// );
// teamsRoutes.delete(
//   '/:id/members/:userId',
//   verifyUserRole('ADMIN'),
//   teamMembersController.delete
// );

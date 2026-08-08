// import { Router } from 'express';
// import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
// import { verifyUserRole } from '@/middlewares/verifyUserRole';

// const tasksRoutes = Router();

// tasksRoutes.use(ensureAuthenticated); // Exige login

// tasksRoutes.post(
//   '/',
//   verifyUserRole(['ADMIN', 'MEMBER']),
//   tasksController.create
// );
// tasksRoutes.get(
//   '/',
//   verifyUserRole(['ADMIN', 'MEMBER']),
//   tasksController.index
// );
// tasksRoutes.get(
//   '/:id',
//   verifyUserRole(['ADMIN', 'MEMBER']),
//   tasksController.show
// );

// tasksRoutes.put(
//   '/:id',
//   verifyUserRole(['ADMIN', 'MEMBER']),
//   tasksController.update
// );

// tasksRoutes.delete('/:id', verifyUserRole('ADMIN'), tasksController.delete);

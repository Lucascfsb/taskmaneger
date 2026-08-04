import { Router } from 'express';
import { sessionsRoutes } from './sessions-routes';
import { usersRoutes } from './users-routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);

export { routes };

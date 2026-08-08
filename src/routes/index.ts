import { Router } from 'express';
import { sessionsRoutes } from './sessions.routes';
import { usersRoutes } from './users.routes';
import { teamsRoutes } from './teams.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/teams', teamsRoutes);

export { routes };

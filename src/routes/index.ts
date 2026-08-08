import { Router } from 'express';
import { sessionsRoutes } from './sessions.routes';
import { usersRoutes } from './users.routes';
import { teamsRoutes } from './teams.routes';
import { tasksRoutes } from './task.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/teams', teamsRoutes);
routes.use('/tasks', tasksRoutes);

export { routes };

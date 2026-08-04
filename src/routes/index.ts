import { Router } from 'express';
import { authRoutes } from './auth-routes';
import { usersRoutes } from './users-routes';

const routes = Router();
routes.use('/sessions', authRoutes);
routes.use('/users', usersRoutes);

export { routes };

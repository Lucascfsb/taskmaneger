import { Router } from 'express';
import { AuthController } from '../controllers/SessionsController';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/', authController.register);

export { authRoutes };

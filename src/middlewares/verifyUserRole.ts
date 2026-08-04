import { Request, Response, NextFunction } from 'express';
import { Role } from '@/generated/prisma/enums';

export function verifyUserRole(roleToVerify: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || user.role !== roleToVerify) {
      return res.status(403).json({ message: 'Acesso não autorizado para este recurso.' });
    }

    return next();
  };
}
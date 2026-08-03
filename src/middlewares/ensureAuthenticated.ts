import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import { Role } from '@/generated/prisma/enums';

interface TokenPayload {
  sub: string;
  role: Role;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'JWT token de acesso não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    req.user = {
      id: Number(decoded.sub),
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Token de acesso inválido ou expirado.' });
  }
}
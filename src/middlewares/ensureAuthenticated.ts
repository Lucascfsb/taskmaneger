import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from "../utils/AppError";
import { authConfig } from "@/configs/authConfig";

interface ITokenPayload {
  sub: string;
  role: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  const [, token] = authHeader.split(' ');

  const { role, sub: user_id } = jwt.verify(
      token,
      authConfig.jwt.secret,
    ) as ITokenPayload;

    req.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
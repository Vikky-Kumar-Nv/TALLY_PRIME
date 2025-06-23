import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
};

export const roleMiddleware = (roles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!roles.includes(user.role)) {
    res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    return;
  }
  next();
};


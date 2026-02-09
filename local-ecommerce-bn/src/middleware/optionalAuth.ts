import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';

export const optionalAuthenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No token, continue without user info
    (req as any).userId = null;
    (req as any).userRole = null;
    (req as any).user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.userId);
    if (user) {
      (req as any).userId = decoded.userId;
      (req as any).userRole = user.role;
      (req as any).user = user;
    } else {
      (req as any).userId = null;
      (req as any).userRole = null;
      (req as any).user = null;
    }
    next();
  } catch (error) {
    // Invalid token, continue without user info
    (req as any).userId = null;
    (req as any).userRole = null;
    (req as any).user = null;
    next();
  }
};

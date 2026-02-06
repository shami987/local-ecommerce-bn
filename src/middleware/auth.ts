import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    (req as any).userId = decoded.userId;
    (req as any).userRole = user.role;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
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
    
    // Check if decoded has userId
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: 'Invalid token: missing user information' });
    }
    
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'Invalid token: user not found' });
    }
    
    (req as any).userId = decoded.userId;
    (req as any).userRole = user.role;
    next();
  } catch (error: any) {
    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token format' });
    }
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
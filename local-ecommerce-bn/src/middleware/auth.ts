import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('[Auth] Authentication attempt:', {
    hasAuthHeader: !!authHeader,
    authHeaderPreview: authHeader ? authHeader.substring(0, 20) + '...' : 'none',
    hasToken: !!token,
    tokenLength: token?.length,
    endpoint: req.path,
    method: req.method
  });

  if (!token) {
    console.log('[Auth] No token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    console.log('[Auth] Token decoded successfully:', { userId: decoded.userId });
    
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      console.log('[Auth] User not found for userId:', decoded.userId);
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    console.log('[Auth] User authenticated:', { userId: user._id, email: user.email, role: user.role });
    (req as any).userId = decoded.userId;
    (req as any).userRole = user.role;
    next();
  } catch (error: any) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
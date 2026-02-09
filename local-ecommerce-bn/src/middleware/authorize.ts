import { Request, Response, NextFunction } from 'express';

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;
    
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    next();
  };
};

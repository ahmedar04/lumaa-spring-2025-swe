import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // expecting "Bearer <token>"
  
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; // no return value
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next(); // continue to next middleware
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    userId: string;
    telegramId: number;
  };
}

/**
 * JWT Middleware to verify authorization
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      telegramId: number;
    };
    req.user = { userId: decoded.userId, telegramId: decoded.telegramId };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, telegramId: number): string {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
    throw new Error('JWT_SECRET is not properly configured');
  }
  const expiresIn = process.env.JWT_EXPIRY || '30d';
  return jwt.sign({ userId, telegramId }, JWT_SECRET, { expiresIn } as any);
}

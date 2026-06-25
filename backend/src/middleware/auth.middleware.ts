import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select('email role isActive');
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid or inactive user');
    }

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch {
    next(new ApiError(401, 'Invalid token'));
  }
}

export function requireAdmin(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    next(new ApiError(403, 'Admin access required'));
    return;
  }
  next();
}

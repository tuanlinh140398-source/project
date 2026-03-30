import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import logger from '../helpers/logger';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('No token provided');
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    await verify(token, process.env.JWT_SECRET as string, 'HS256');
    await next();
  } catch (error) {
    logger.warn('Invalid or expired token');
    return c.json({ message: 'Forbidden' }, 403);
  }
};
import type { Context } from 'hono';
import logger from './logger';

export const successResponse = (c: Context, data?: object) => {
  return c.json({ message: 'Success', ...data }, 200);
};

export const createdResponse = (c: Context, data?: object) => {
  return c.json({ message: 'Success', ...data }, 200);
};

export const notFoundResponse = (c: Context) => {
  return c.json({ message: 'Not Found' }, 404);
};

export const badRequestResponse = (c: Context, message: string) => {
  return c.json({ message }, 400);
};

export const errorResponse = (c: Context, error: any) => {
  logger.error(error.message);
  return c.json({ message: 'Internal Server Error', error: error.message }, 500);
};
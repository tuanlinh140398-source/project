import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErrorHandler } from '../errors/errorHandler.js';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      ErrorHandler.handle(error, res);
    }
  };
};

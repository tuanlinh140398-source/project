import { Response } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError, ValidationErrorDetail } from './AppError.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ResponseWrapper } from '../utils/responseWrapper.js';
import { Logger } from '../utils/logger.js';

export class ErrorHandler {
  static handle(error: any, res: Response): void {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const details: ValidationErrorDetail[] = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      Logger.warn('Validation error', { field: details[0]?.field });
      ResponseWrapper.error(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, details);
      return;
    }

    // Handle custom AppError
    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        Logger.error(`${error.name}: ${error.message}`, error);
      } else {
        Logger.warn(`${error.name}: ${error.message}`);
      }
      ResponseWrapper.error(res, error.message, error.statusCode, error.details || undefined);
      return;
    }

    // Handle unexpected errors
    Logger.error('Unexpected error', error);
    ResponseWrapper.error(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

import { Response } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError, ValidationErrorDetail } from './AppError.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

export class ErrorHandler {
  static handle(error: any, res: Response): void {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const details: ValidationErrorDetail[] = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      const validationError = new ValidationError(details);
      this.sendError(validationError, res);
      return;
    }

    // Handle custom AppError
    if (error instanceof AppError) {
      this.sendError(error, res);
      return;
    }

    // Handle unexpected errors
    const internalError = new AppError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    this.sendError(internalError, res);
  }

  private static sendError(error: AppError, res: Response): void {
    const response: any = {
      success: false,
      error: error.message
    };

    if (error.details) {
      response.errors = error.details;
    }

    res.status(error.statusCode).json(response);
  }
}

import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ResponseWrapper {
  static success<T>(res: Response, data: T, statusCode: number = HTTP_STATUS.OK): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    } as ApiSuccessResponse<T>);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    const response: ApiErrorResponse = {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }
}

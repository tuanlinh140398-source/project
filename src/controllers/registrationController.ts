import { Request, Response } from 'express';
import { CloudflareEnv, RegistrationResponse, Registration } from '../types/index.js';
import { RegistrationService } from '../services/registrationService.js';
import { ErrorHandler } from '../errors/errorHandler.js';
import { AppError } from '../errors/AppError.js';
import { ResponseWrapper } from '../utils/responseWrapper.js';
import { Logger } from '../utils/logger.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export class RegistrationController {
  static async register(req: Request & { env?: CloudflareEnv }, res: Response): Promise<void> {
    try {
      const env = req.env;
      if (!env || !env.DB) {
        throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DATABASE_CONNECTION_NOT_AVAILABLE);
      }

      const service = new RegistrationService(env.DB);
      const data = await service.register(req.body);

      Logger.info('Registration created', { employeeCode: data.employeeCode });
      ResponseWrapper.success(res, data, HTTP_STATUS.CREATED);
    } catch (error) {
      ErrorHandler.handle(error, res);
    }
  }

  static async list(req: Request & { env?: CloudflareEnv }, res: Response): Promise<void> {
    try {
      const env = req.env;
      if (!env || !env.DB) {
        throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DATABASE_CONNECTION_NOT_AVAILABLE);
      }

      const service = new RegistrationService(env.DB);
      const registrations = await service.getAll();

      const response: RegistrationResponse[] = registrations.map((reg: Registration) => ({
        id: reg.id,
        fullName: reg.fullName,
        employeeCode: reg.employeeCode,
        department: reg.department,
        phoneNumber: reg.phoneNumber,
        created: new Date(reg.createdAt).toLocaleDateString('vi-VN')
      }));

      Logger.info('Fetched registrations', { count: response.length });
      ResponseWrapper.success(res, response, HTTP_STATUS.OK);
    } catch (error) {
      ErrorHandler.handle(error, res);
    }
  }
}

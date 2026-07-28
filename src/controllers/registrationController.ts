import { Request, Response } from 'express';
import { CloudflareEnv, RegistrationResponse, Registration } from '../types/index.js';
import { RegistrationService } from '../services/registrationService.js';

export class RegistrationController {
  static async register(req: Request & { env?: CloudflareEnv }, res: Response): Promise<void> {
    try {
      const env = req.env;
      if (!env || !env.DB) {
        res.status(500).json({
          success: false,
          error: 'Database connection not available'
        });
        return;
      }

      const service = new RegistrationService(env.DB);
      const result = await service.register(req.body);

      if (!result.success) {
        if (result.errors) {
          res.status(400).json({
            success: false,
            errors: result.errors
          });
        } else if (result.error === 'Employee code already registered') {
          res.status(409).json({
            success: false,
            error: result.error
          });
        } else {
          res.status(400).json({
            success: false,
            error: result.error
          });
        }
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async list(req: Request & { env?: CloudflareEnv }, res: Response): Promise<void> {
    try {
      const env = req.env;
      if (!env || !env.DB) {
        res.status(500).json({
          success: false,
          error: 'Database connection not available'
        });
        return;
      }

      const service = new RegistrationService(env.DB);
      const result = await service.getAll();

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: result.error
        });
        return;
      }

      const response: RegistrationResponse[] = (result.data || []).map((reg: Registration) => ({
        id: reg.id,
        fullName: reg.fullName,
        employeeCode: reg.employeeCode,
        department: reg.department,
        phoneNumber: reg.phoneNumber,
        created: new Date(reg.createdAt).toLocaleDateString('vi-VN')
      }));

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

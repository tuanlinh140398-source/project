import { Router, Request, Response } from 'express';
import { RegistrationController } from '../controllers/registrationController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registrationSchema } from '../validation/schemas.js';

export function createRegistrationRouter(): Router {
  const router = Router();

  router.post('/registrations', validateRequest(registrationSchema), (req: Request, res: Response) => {
    RegistrationController.register(req, res);
  });

  router.get('/list', (req: Request, res: Response) => {
    RegistrationController.list(req, res);
  });

  return router;
}

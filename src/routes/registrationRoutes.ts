import { Router, Request, Response } from 'express';
import { RegistrationController } from '../controllers/registrationController.js';

export function createRegistrationRouter(): Router {
  const router = Router();

  router.post('/registrations', (req: Request, res: Response) => {
    RegistrationController.register(req, res);
  });

  router.get('/list', (req: Request, res: Response) => {
    RegistrationController.list(req, res);
  });

  return router;
}

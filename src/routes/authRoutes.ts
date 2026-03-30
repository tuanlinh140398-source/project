import { Router } from 'express';
import { generateToken, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/token', generateToken);
router.post('/refresh', refreshToken);

export default router;
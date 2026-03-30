import { Hono } from 'hono';
import { generateToken, refreshToken } from '../controllers/authController';

const router = new Hono();

router.post('/token', generateToken);
router.post('/refresh', refreshToken);

export default router;
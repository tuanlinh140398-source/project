import { Hono } from 'hono';
import { createUser, updateUser, getUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = new Hono();

router.post('/users', authMiddleware, createUser);
router.get('/users/:id', authMiddleware, getUser);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;
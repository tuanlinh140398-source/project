import { Router } from 'express';
import { createUser, updateUser, getUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/users', authMiddleware, createUser);
router.put('/users/:id', authMiddleware, updateUser);
router.get('/users/:id', authMiddleware, getUser);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;
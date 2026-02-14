import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authenticateToken, authorize('admin'), getAllUsers);
router.get('/:id', authenticateToken, authorize('admin'), getUserById);
router.put('/:id', authenticateToken, authorize('admin'), updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), deleteUser);

export default router;

import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authenticateToken, authorize('admin'), getAllUsers);
router.put('/:id', authenticateToken, authorize('admin'), updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), deleteUser);

export default router;

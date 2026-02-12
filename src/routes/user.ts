import { Router } from 'express';
import { UserModel } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Get all users (admin only)
router.get('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

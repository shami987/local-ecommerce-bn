import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController';

const router = Router();

router.get('/', authenticateToken, getMyOrders);
router.get('/all', authenticateToken, authorize('admin'), getAllOrders);
router.post('/', authenticateToken, createOrder);
router.put('/:id/status', authenticateToken, authorize('admin', 'business_owner'), updateOrderStatus);

export default router;

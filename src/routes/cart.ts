import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, addToCart);

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update product quantity in cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart updated
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticateToken, updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove product from cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 */
router.delete('/:productId', authenticateToken, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 */
router.delete('/clear/all', authenticateToken, clearCart);

export default router;

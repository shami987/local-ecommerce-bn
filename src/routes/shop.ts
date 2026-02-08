import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop
} from '../controllers/shopController';

const router = Router();

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all shops (Public)
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get('/', getAllShops);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get shop by ID (Public)
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop details
 *       404:
 *         description: Shop not found
 */
router.get('/:id', getShopById);

/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a new shop (Protected)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - telephone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: Upload image file
 *                   - type: string
 *                     description: Image URL
 *     responses:
 *       201:
 *         description: Shop created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, authorize('admin', 'business_owner'), upload.single('image'), createShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Update a shop (Protected)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: Upload image file
 *                   - type: string
 *                     description: Image URL
 *     responses:
 *       200:
 *         description: Shop updated
 *       404:
 *         description: Shop not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticateToken, authorize('admin', 'business_owner'), upload.single('image'), updateShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete a shop (Protected)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop deleted
 *       404:
 *         description: Shop not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateToken, authorize('admin', 'business_owner'), deleteShop);

export default router;

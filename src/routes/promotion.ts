import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';
import {
  getAllPromotions,
  getActivePromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getMyPromotions
} from '../controllers/promotionController';

const router = Router();

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions (Public)
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get('/', getAllPromotions);

/**
 * @swagger
 * /api/promotions/my:
 *   get:
 *     summary: Get my promotions (Protected)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's promotions
 */
router.get('/my', authenticateToken, authorize('admin', 'business_owner'), getMyPromotions);

/**
 * @swagger
 * /api/promotions/active:
 *   get:
 *     summary: Get active promotions only (Public)
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of active promotions
 */
router.get('/active', getActivePromotions);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get promotion by ID (Public)
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Promotion not found
 */
router.get('/:id', getPromotionById);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion (Protected)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - discountType
 *               - discountValue
 *               - location
 *               - startDate
 *               - endDate
 *               - shop
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               shop:
 *                 type: string
 *               category:
 *                 type: string
 *               terms:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Promotion created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, authorize('admin', 'business_owner'), upload.single('bannerImage'), createPromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion (Protected)
 *     tags: [Promotions]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               shop:
 *                 type: string
 *               category:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               terms:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Promotion updated
 *       404:
 *         description: Promotion not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticateToken, authorize('admin', 'business_owner'), upload.single('bannerImage'), updatePromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion (Protected)
 *     tags: [Promotions]
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
 *         description: Promotion deleted
 *       404:
 *         description: Promotion not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateToken, authorize('admin', 'business_owner'), deletePromotion);

export default router;

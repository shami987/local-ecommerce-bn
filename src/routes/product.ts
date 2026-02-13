import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} from '../controllers/productController';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (Public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/my:
 *   get:
 *     summary: Get my products (Protected)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's products
 */
router.get('/my', authenticateToken, authorize('admin', 'business_owner'), getMyProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (Public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Protected)
 *     tags: [Products]
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
 *               - price
 *               - category
 *               - seller
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               shop:
 *                 type: string
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: Upload image file
 *                   - type: string
 *                     description: Image URL
 *               stock:
 *                 type: number
 *               seller:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, authorize('admin', 'business_owner'), upload.single('image'), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Protected)
 *     tags: [Products]
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
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               shop:
 *                 type: string
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: Upload image file
 *                   - type: string
 *                     description: Image URL
 *               stock:
 *                 type: number
 *               seller:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticateToken, authorize('admin', 'business_owner'), upload.single('image'), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Protected)
 *     tags: [Products]
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateToken, authorize('admin', 'business_owner'), deleteProduct);

export default router;

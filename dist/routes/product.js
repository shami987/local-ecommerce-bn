"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const upload_1 = require("../middleware/upload");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
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
router.get('/', productController_1.getAllProducts);
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
router.get('/:id', productController_1.getProductById);
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
router.post('/', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), upload_1.upload.single('image'), productController_1.createProduct);
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
router.put('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), upload_1.upload.single('image'), productController_1.updateProduct);
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
router.delete('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), productController_1.deleteProduct);
exports.default = router;

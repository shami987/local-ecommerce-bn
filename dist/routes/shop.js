"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const upload_1 = require("../middleware/upload");
const shopController_1 = require("../controllers/shopController");
const router = (0, express_1.Router)();
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
router.get('/', shopController_1.getAllShops);
/**
 * @swagger
 * /api/shops/my:
 *   get:
 *     summary: Get my shops (Protected)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's shops
 */
router.get('/my', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), shopController_1.getMyShops);
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
router.get('/:id', shopController_1.getShopById);
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
router.post('/', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), upload_1.upload.single('image'), shopController_1.createShop);
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
router.put('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), upload_1.upload.single('image'), shopController_1.updateShop);
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
router.delete('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin', 'business_owner'), shopController_1.deleteShop);
exports.default = router;

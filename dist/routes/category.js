"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const upload_1 = require("../middleware/upload");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (Public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', categoryController_1.getAllCategories);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID (Public)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController_1.getCategoryById);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Protected)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
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
 *         description: Category created
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth_1.authenticateToken, (0, authorize_1.authorize)('admin'), upload_1.upload.single('image'), categoryController_1.createCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Protected)
 *     tags: [Categories]
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
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: Upload image file
 *                   - type: string
 *                     description: Image URL
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin'), upload_1.upload.single('image'), categoryController_1.updateCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Protected)
 *     tags: [Categories]
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
 *         description: Category deleted
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', auth_1.authenticateToken, (0, authorize_1.authorize)('admin'), categoryController_1.deleteCategory);
exports.default = router;

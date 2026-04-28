const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag management
 */

// Public routes
/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Tag' }
 */
router.get('/', tagController.getTags);

/**
 * @swagger
 * /api/tags/{slug}:
 *   get:
 *     summary: Get a tag by slug
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag object
 *       404:
 *         description: Tag not found
 */
router.get('/:slug', tagController.getTag);

// Protected admin routes
router.use(protect, authorize('admin', 'superadmin'));

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a tag (Admin)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name: { type: 'string' }
 *     responses:
 *       201:
 *         description: Tag created
 *       400:
 *         description: Validation error
 */
router.post('/', tagController.createTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update a tag (Admin)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: 'string' }
 *     responses:
 *       200:
 *         description: Tag updated
 *       404:
 *         description: Tag not found
 */
router.put('/:id', tagController.updateTag);
/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag (Admin)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag deleted
 *       404:
 *         description: Tag not found
 */
router.delete('/:id', tagController.deleteTag);

module.exports = router;

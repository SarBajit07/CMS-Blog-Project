const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, authorize, optionalAuth } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Get approved comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/post/:postId', commentController.getPostComments);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   post:
 *     summary: Submit a comment for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body: { type: 'string' }
 *               parentId: { type: 'integer', nullable: true }
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/post/:postId', optionalAuth, commentController.createComment);

// Protected admin routes
router.use(protect, authorize('admin', 'superadmin'));

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments (Admin)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 */
router.get('/', commentController.getAllComments);

/**
 * @swagger
 * /api/comments/{id}/approve:
 *   put:
 *     summary: Approve or unapprove a comment (Admin)
 *     tags: [Comments]
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
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved: { type: 'boolean' }
 *     responses:
 *       200:
 *         description: Comment status updated
 */
router.put('/:id/approve', commentController.approveComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment (Admin)
 *     tags: [Comments]
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
 *         description: Comment deleted
 */
router.delete('/:id', commentController.deleteComment);

module.exports = router;

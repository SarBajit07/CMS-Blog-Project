const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');
const postController = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post endpoints
 */

// Validation rules
const postValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('body').notEmpty().withMessage('Body is required'),
];

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all published posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', postController.getPosts);

/**
 * @swagger
 * /api/posts/me:
 *   get:
 *     summary: Get all posts by logged in author
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of author's posts
 */
router.get('/me', protect, postController.getMyPosts);

/**
 * @swagger
 * /api/posts/id/{id}:
 *   get:
 *     summary: Get post by ID (for editing)
 *     tags: [Posts]
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
 *         description: Post data
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.get('/id/:id', protect, postController.getPostById);

/**
 * @swagger
 * /api/posts/{slug}:
 *   get:
 *     summary: Get post by slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 */
router.get('/:slug', postController.getPost);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               body:
 *                 type: string
 *               cover_image_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Post created
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, validate(postValidation), postController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               body:
 *                 type: string
 *               cover_image_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Post updated
 *       403:
 *         description: Forbidden (not the author)
 *       404:
 *         description: Post not found
 */
router.put('/:id', protect, validate(postValidation), postController.updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
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
 *         description: Post deleted
 *       403:
 *         description: Forbidden (not the author)
 *       404:
 *         description: Post not found
 */
router.delete('/:id', protect, postController.deletePost);

module.exports = router;

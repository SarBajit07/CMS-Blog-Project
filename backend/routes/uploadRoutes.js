const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: File upload operations
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file (Image/Video) to Cloudinary
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  // req.file.path contains the secure Cloudinary URL
  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: req.file.path,
      format: req.file.mimetype,
      filename: req.file.filename
    }
  });
});

module.exports = router;

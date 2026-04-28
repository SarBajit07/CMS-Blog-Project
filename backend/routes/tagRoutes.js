const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', tagController.getTags);
router.get('/:slug', tagController.getTag);

// Protected admin routes
router.use(protect, authorize('admin', 'superadmin'));

router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;

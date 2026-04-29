const CommentModel = require('../models/commentModel');
const response = require('../utils/responseHelper');

const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { body, parentId } = req.body;
    const authorId = req.user ? req.user.id : null;

    if (!body) {
      return response.error(res, 400, 'Comment body is required');
    }
    
    // Automatically approve if it's an admin/superadmin, otherwise false
    let isApproved = false;
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
      isApproved = true;
    }

    const comment = await CommentModel.create({
      postId,
      authorId,
      parentId,
      body,
      isApproved
    });

    return response.success(res, 201, { comment }, 'Comment submitted successfully');
  } catch (err) {
    next(err);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // We only fetch approved comments for the public endpoint
    const comments = await CommentModel.getByPostId(postId, true);
    
    return response.success(res, 200, { comments });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.getAll();
    return response.success(res, 200, { comments });
  } catch (err) {
    next(err);
  }
};

const approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const comment = await CommentModel.updateStatus(id, isApproved);
    if (!comment) {
      return response.error(res, 404, 'Comment not found');
    }
    
    return response.success(res, 200, { comment }, 'Comment status updated');
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await CommentModel.deleteById(id);
    if (!deleted) {
      return response.error(res, 404, 'Comment not found');
    }
    
    return response.success(res, 200, null, 'Comment deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  getPostComments,
  getAllComments,
  approveComment,
  deleteComment
};

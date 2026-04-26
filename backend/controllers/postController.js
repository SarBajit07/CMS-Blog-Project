const slugify = require('slugify');
const PostModel = require('../models/postModel');
const response = require('../utils/responseHelper');

// @desc    Get all published posts
// @route   GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.getAll();
    return response.success(res, 200, { posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single post by slug
// @route   GET /api/posts/:slug
const getPost = async (req, res, next) => {
  try {
    const post = await PostModel.getBySlug(req.params.slug);
    if (!post) {
      return response.error(res, 404, 'Post not found');
    }
    return response.success(res, 200, { post });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts  (protected)
const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, body, cover_image_url, status } = req.body;
    const author_id = req.user.id;
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await PostModel.create({
      author_id,
      title,
      slug,
      excerpt,
      body,
      cover_image_url,
      status: status || 'draft',
    });

    return response.success(res, 201, { post: newPost }, 'Post created successfully');
  } catch (err) {
    // Handle unique slug conflict
    if (err.code === '23505') {
      return response.error(res, 400, 'A post with this title/slug already exists');
    }
    next(err);
  }
};

// @desc    Update an existing post
// @route   PUT /api/posts/:id  (protected)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, excerpt, body, cover_image_url, status } = req.body;

    // Verify ownership (author can only edit own posts, admin can edit any)
    const existing = await PostModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Post not found');
    }
    if (req.user.role !== 'admin' && existing.author_id !== req.user.id) {
      return response.error(res, 403, 'You can only edit your own posts');
    }

    const slug = title ? slugify(title, { lower: true, strict: true }) : existing.slug;

    const updatedPost = await PostModel.update(id, {
      title: title || existing.title,
      slug,
      excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
      body: body !== undefined ? body : existing.body,
      cover_image_url: cover_image_url !== undefined ? cover_image_url : existing.cover_image_url,
      status: status || existing.status,
    });

    return response.success(res, 200, { post: updatedPost }, 'Post updated successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id  (protected)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await PostModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Post not found');
    }
    if (req.user.role !== 'admin' && existing.author_id !== req.user.id) {
      return response.error(res, 403, 'You can only delete your own posts');
    }

    await PostModel.deleteById(id);
    return response.success(res, 200, null, 'Post deleted successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Get all posts for the logged in user
// @route   GET /api/posts/me  (protected)
const getMyPosts = async (req, res, next) => {
  try {
    const author_id = req.user.id;
    const posts = await PostModel.getByAuthor(author_id);
    return response.success(res, 200, { posts });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
};

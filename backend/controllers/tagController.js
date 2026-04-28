const slugify = require('slugify');
const TagModel = require('../models/tagModel');
const response = require('../utils/responseHelper');

// @desc    Get all tags
// @route   GET /api/tags
const getTags = async (req, res, next) => {
  try {
    const tags = await TagModel.getAll();
    return response.success(res, 200, { tags });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single tag by slug
// @route   GET /api/tags/:slug
const getTag = async (req, res, next) => {
  try {
    const tag = await TagModel.getBySlug(req.params.slug);
    if (!tag) {
      return response.error(res, 404, 'Tag not found');
    }
    return response.success(res, 200, { tag });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new tag
// @route   POST /api/tags  (admin only)
const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return response.error(res, 400, 'Name is required');
    }
    const slug = slugify(name, { lower: true, strict: true });

    const newTag = await TagModel.create({
      name,
      slug,
    });

    return response.success(res, 201, { tag: newTag }, 'Tag created successfully');
  } catch (err) {
    if (err.code === '23505') {
      return response.error(res, 400, 'A tag with this name/slug already exists');
    }
    next(err);
  }
};

// @desc    Update an existing tag
// @route   PUT /api/tags/:id  (admin only)
const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existing = await TagModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Tag not found');
    }

    const slug = name ? slugify(name, { lower: true, strict: true }) : existing.slug;

    const updatedTag = await TagModel.update(id, {
      name: name || existing.name,
      slug,
    });

    return response.success(res, 200, { tag: updatedTag }, 'Tag updated successfully');
  } catch (err) {
    if (err.code === '23505') {
      return response.error(res, 400, 'A tag with this name/slug already exists');
    }
    next(err);
  }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id  (admin only)
const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await TagModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Tag not found');
    }

    await TagModel.deleteById(id);
    return response.success(res, 200, null, 'Tag deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
};

const slugify = require('slugify');
const CategoryModel = require('../models/categoryModel');
const response = require('../utils/responseHelper');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.getAll();
    return response.success(res, 200, { categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single category by slug
// @route   GET /api/categories/:slug
const getCategory = async (req, res, next) => {
  try {
    const category = await CategoryModel.getBySlug(req.params.slug);
    if (!category) {
      return response.error(res, 404, 'Category not found');
    }
    return response.success(res, 200, { category });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new category
// @route   POST /api/categories  (admin only)
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return response.error(res, 400, 'Name is required');
    }
    const slug = slugify(name, { lower: true, strict: true });

    const newCategory = await CategoryModel.create({
      name,
      slug,
      description,
    });

    return response.success(res, 201, { category: newCategory }, 'Category created successfully');
  } catch (err) {
    if (err.code === '23505') {
      return response.error(res, 400, 'A category with this name/slug already exists');
    }
    next(err);
  }
};

// @desc    Update an existing category
// @route   PUT /api/categories/:id  (admin only)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await CategoryModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Category not found');
    }

    const slug = name ? slugify(name, { lower: true, strict: true }) : existing.slug;

    const updatedCategory = await CategoryModel.update(id, {
      name: name || existing.name,
      slug,
      description: description !== undefined ? description : existing.description,
    });

    return response.success(res, 200, { category: updatedCategory }, 'Category updated successfully');
  } catch (err) {
    if (err.code === '23505') {
      return response.error(res, 400, 'A category with this name/slug already exists');
    }
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id  (admin only)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await CategoryModel.getById(id);
    if (!existing) {
      return response.error(res, 404, 'Category not found');
    }

    await CategoryModel.deleteById(id);
    return response.success(res, 200, null, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

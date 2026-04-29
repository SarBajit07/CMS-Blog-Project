const UserModel = require('../models/userModel');
const response = require('../utils/responseHelper');

// @desc    Get all users (admin only)
// @route   GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAll();
    return response.success(res, 200, { users });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role (admin only)
// @route   PATCH /api/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['author', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return response.error(res, 400, 'Invalid role. Must be "author", "admin", or "superadmin"');
    }

    const updatedUser = await UserModel.updateRole(id, role);
    if (!updatedUser) {
      return response.error(res, 404, 'User not found');
    }

    return response.success(res, 200, { user: updatedUser }, 'Role updated successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await UserModel.deleteById(id);
    if (!deleted) {
      return response.error(res, 404, 'User not found');
    }

    return response.success(res, 200, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};

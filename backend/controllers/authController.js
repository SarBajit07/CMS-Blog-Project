const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const response = require('../utils/responseHelper');

// Cookie options — centralised so logout uses the same settings
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,                                      // JavaScript CANNOT read this
  secure: process.env.NODE_ENV === 'production',       // HTTPS only in prod
  sameSite: 'strict',                                  // no cross-site sending
  path: '/',                                           // available on all paths
  maxAge: 7 * 24 * 60 * 60 * 1000,                    // 7 days
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return response.error(res, 400, 'Email already in use');
    }

    // Check if username already exists
    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return response.error(res, 400, 'Username already taken');
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await UserModel.create({ username, email, passwordHash });

    return response.success(res, 201, { user: newUser }, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & return tokens
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return response.error(res, 401, 'Invalid credentials');
    }

    // Check if account is active
    if (user.is_active === false) {
      return response.error(res, 403, 'Account has been deactivated');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return response.error(res, 401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as HTTP-only cookie (XSS-proof)
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return response.success(res, 200, {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar_url,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token using the HTTP-only refresh cookie
// @route   POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return response.error(res, 401, 'No refresh token');
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      // Clear the invalid cookie
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
      return response.error(res, 401, 'Invalid or expired refresh token');
    }

    // Look up the user to ensure they still exist & are active
    const user = await UserModel.findById(decoded.id);
    if (!user || user.is_active === false) {
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
      return response.error(res, 401, 'User not found or deactivated');
    }

    // Issue a fresh access token
    const accessToken = generateAccessToken(user);

    return response.success(res, 200, { accessToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user from refresh cookie (session restoration on page reload)
// @route   GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return response.error(res, 401, 'Not authenticated');
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
      return response.error(res, 401, 'Session expired');
    }

    // Look up the full user
    const user = await UserModel.findById(decoded.id);
    if (!user || user.is_active === false) {
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
      return response.error(res, 401, 'User not found or deactivated');
    }

    // Issue a fresh access token & return user profile
    const accessToken = generateAccessToken(user);

    return response.success(res, 200, {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user profile
// @route   PATCH /api/auth/me
const updateMe = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    
    // req.user is populated by 'protect' middleware
    const updatedUser = await UserModel.updateProfile(req.user.id, { avatar_url: avatarUrl });

    return response.success(res, 200, {
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatar_url,
      }
    }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
  return response.success(res, 200, null, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  refresh,
  me,
  updateMe,
  logout,
};

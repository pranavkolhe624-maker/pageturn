import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    return successResponse(res, 'Profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { name, phone, street, city, state, pincode } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (street || city || state || pincode) {
      updateData.address = {
        street: street || user.address?.street,
        city: city || user.address?.city,
        state: state || user.address?.state,
        pincode: pincode || user.address?.pincode,
      };
    }

    if (req.file && req.file.url) {
      // Delete old avatar if exists
      if (user.avatar) {
        try {
          const publicId = user.avatar.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`pageturn/avatars/${publicId}`);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }
      updateData.avatar = req.file.url;
    }

    user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    next(error);
  }
};

// Add to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    let user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    if (user.wishlist.includes(bookId)) {
      return errorResponse(res, 'Book already in wishlist', null, 400);
    }

    user.wishlist.push(bookId);
    await user.save();

    user = await user.populate('wishlist');

    return successResponse(res, 'Book added to wishlist', { wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    let user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    if (!user.wishlist.includes(bookId)) {
      return errorResponse(res, 'Book not in wishlist', null, 404);
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    await user.save();

    user = await user.populate('wishlist');

    return successResponse(res, 'Book removed from wishlist', { wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Get wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: {
        path: 'seller',
        select: 'name email avatar',
      },
    });

    return successResponse(res, 'Wishlist fetched successfully', { wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (role) filter.role = role;

    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .limit(limit)
      .skip(startIndex);

    return successResponse(res, 'Users fetched successfully', {
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('wishlist');

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    return successResponse(res, 'User fetched successfully', { user });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorResponse(res, 'User not found', null, 404);
    }
    next(error);
  }
};

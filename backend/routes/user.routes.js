import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllUsers,
  getUserById,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadBookCover, uploadToCloudinary } from '../middleware/upload.middleware.js';

const router = express.Router();

// Protected routes
router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  uploadBookCover,
  uploadToCloudinary,
  [
    body('name', 'Name is optional').optional().notEmpty(),
    body('phone', 'Phone is optional').optional().notEmpty(),
  ],
  updateProfile
);

router.post('/wishlist/:bookId', protect, addToWishlist);
router.delete('/wishlist/:bookId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);

export default router;

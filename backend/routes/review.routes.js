import express from 'express';
import { body } from 'express-validator';
import {
  addReview,
  getBookReviews,
  deleteReview,
  getMyReviews,
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add review
router.post(
  '/book/:bookId',
  protect,
  [
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment is optional').optional().isLength({ max: 1000 }),
  ],
  addReview
);

// Get reviews for a book (public)
router.get('/book/:bookId', getBookReviews);

// Delete review
router.delete('/:id', protect, deleteReview);

// Get my reviews
router.get('/user/my-reviews', protect, getMyReviews);

export default router;

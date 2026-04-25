import Review from '../models/Review.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

// Add review
export const addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { bookId } = req.params;
    const { rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    // Check if user has purchased this book
    const purchase = await Order.findOne({
      buyer: req.user._id,
      'items.book': bookId,
      orderStatus: { $in: ['Confirmed', 'Shipped', 'Delivered'] },
    });

    if (!purchase) {
      return errorResponse(res, 'You can only review books you have purchased', null, 403);
    }

    // Check if review already exists
    let review = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (review) {
      return errorResponse(res, 'You have already reviewed this book', null, 400);
    }

    // Create review
    review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    // Update book rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      'rating.average': avgRating.toFixed(1),
      'rating.count': reviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    return successResponse(res, 'Review added successfully', { review: populatedReview }, 201);
  } catch (error) {
    next(error);
  }
};

// Get reviews for a book
export const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const book = await Book.findById(bookId);
    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    const startIndex = (page - 1) * limit;
    const total = await Review.countDocuments({ book: bookId });
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name avatar email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    return successResponse(res, 'Reviews fetched successfully', {
      reviews,
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

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 'Review not found', null, 404);
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this review', null, 403);
    }

    const bookId = review.book;

    await Review.findByIdAndDelete(req.params.id);

    // Update book rating
    const reviews = await Review.find({ book: bookId });

    if (reviews.length === 0) {
      await Book.findByIdAndUpdate(bookId, {
        'rating.average': 0,
        'rating.count': 0,
      });
    } else {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Book.findByIdAndUpdate(bookId, {
        'rating.average': avgRating.toFixed(1),
        'rating.count': reviews.length,
      });
    }

    return successResponse(res, 'Review deleted successfully', {});
  } catch (error) {
    next(error);
  }
};

// Get user's reviews
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author coverImage')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Your reviews fetched successfully', { reviews });
  } catch (error) {
    next(error);
  }
};

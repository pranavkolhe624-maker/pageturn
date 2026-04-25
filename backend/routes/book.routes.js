import express from 'express';
import { body } from 'express-validator';
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getMyBooks,
  approveBook,
  getPendingBooks,
} from '../controllers/book.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadBookCover, uploadToCloudinary } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBook);

// Protected routes
router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  uploadBookCover,
  uploadToCloudinary,
  [
    body('title', 'Title is required').notEmpty(),
    body('author', 'Author is required').notEmpty(),
    body('isbn', 'ISBN is required').notEmpty(),
    body('genre', 'Genre is required').notEmpty(),
    body('condition', 'Condition is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('stock', 'Stock must be a positive integer').isInt({ min: 0 }),
  ],
  createBook
);

router.put(
  '/:id',
  protect,
  uploadBookCover,
  uploadToCloudinary,
  updateBook
);

router.delete('/:id', protect, deleteBook);

router.get('/seller/my-books', protect, getMyBooks);

// Admin routes
router.patch('/:id/approve', protect, authorize('admin'), approveBook);
router.get('/admin/pending', protect, authorize('admin'), getPendingBooks);

export default router;

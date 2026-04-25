import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getAllUsers, getUserById } from '../controllers/user.controller.js';
import { getPendingBooks, approveBook } from '../controllers/book.controller.js';
import { getAllOrders } from '../controllers/order.controller.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Book management
router.get('/books/pending', getPendingBooks);
router.patch('/books/:id/approve', approveBook);

// Order management
router.get('/orders', getAllOrders);

export default router;

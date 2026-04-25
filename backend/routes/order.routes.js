import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.post(
  '/',
  protect,
  [
    body('items', 'Items array is required').isArray({ min: 1 }),
    body('items.*.bookId', 'Book ID is required for each item').notEmpty(),
    body('items.*.quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
    body('shippingAddress', 'Shipping address is required').notEmpty(),
    body('paymentMethod', 'Payment method is required').isIn(['COD', 'UPI', 'Card']),
  ],
  createOrder
);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

router.patch(
  '/:id/status',
  protect,
  authorize('seller', 'admin'),
  [body('orderStatus', 'Valid order status is required').optional().isIn(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'])],
  updateOrderStatus
);

router.delete(
  '/:id',
  protect,
  [body('cancellationReason', 'Cancellation reason is required').notEmpty()],
  cancelOrder
);

// Admin route
router.get('/', protect, authorize('admin'), getAllOrders);

export default router;

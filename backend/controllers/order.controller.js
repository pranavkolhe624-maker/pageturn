import Order from '../models/Order.js';
import Book from '../models/Book.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

// Create order
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, 'Order items are required', null, 400);
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return errorResponse(res, `Book with ID ${item.bookId} not found`, null, 404);
      }

      if (book.stock < item.quantity) {
        return errorResponse(res, `Insufficient stock for ${book.title}`, null, 400);
      }

      const effectivePrice = book.getEffectivePrice();
      const itemTotal = effectivePrice * item.quantity;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: effectivePrice,
      });

      totalAmount += itemTotal;
    }

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Reduce stock
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: -item.quantity },
      });
    }

    const populatedOrder = await Order.findById(order._id).populate('items.book');

    return successResponse(res, 'Order placed successfully', { order: populatedOrder }, 201);
  } catch (error) {
    next(error);
  }
};

// Get user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.book')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Orders fetched successfully', { orders });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.book')
      .populate('buyer', 'name email phone address');

    if (!order) {
      return errorResponse(res, 'Order not found', null, 404);
    }

    // Check if user is buyer or admin
    if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to view this order', null, 403);
    }

    return successResponse(res, 'Order fetched successfully', { order });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorResponse(res, 'Order not found', null, 404);
    }
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingId } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 'Order not found', null, 404);
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingId) order.trackingId = trackingId;

    await order.save();

    return successResponse(res, 'Order status updated successfully', { order });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 'Order not found', null, 404);
    }

    // Check ownership
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to cancel this order', null, 403);
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return errorResponse(res, `Cannot cancel order with status: ${order.orderStatus}`, null, 400);
    }

    const { cancellationReason } = req.body;

    order.orderStatus = 'Cancelled';
    order.cancellationReason = cancellationReason || '';

    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity },
      });
    }

    return successResponse(res, 'Order cancelled successfully', { order });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, startDate, endDate, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const startIndex = (page - 1) * limit;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('buyer', 'name email phone')
      .populate('items.book')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    return successResponse(res, 'Orders fetched successfully', {
      orders,
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

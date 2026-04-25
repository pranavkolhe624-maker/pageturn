import Book from '../models/Book.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';
import cloudinary from '../config/cloudinary.js';

// Get all books with filtering and pagination
export const getAllBooks = async (req, res, next) => {
  try {
    const { genre, condition, minPrice, maxPrice, rating, sort, page = 1, limit = 10, search } = req.query;

    let filter = { isApproved: true };

    if (genre) filter.genre = genre;
    if (condition) filter.condition = condition;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.$expr = {
        $lte: [
          { $cond: [{ $eq: ['$discountPrice', null] }, '$price', '$discountPrice'] },
          maxPrice ? parseInt(maxPrice) : Number.MAX_VALUE,
        ],
      };
      if (minPrice) {
        filter.$expr.$gte = [
          { $cond: [{ $eq: ['$discountPrice', null] }, '$price', '$discountPrice'] },
          parseInt(minPrice),
        ];
      }
    }

    if (rating) {
      filter['rating.average'] = { $gte: parseInt(rating) };
    }

    let sortBy = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sortBy[field.substring(1)] = -1;
        } else {
          sortBy[field] = 1;
        }
      });
    }

    const startIndex = (page - 1) * limit;

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .populate('seller', 'name email avatar')
      .sort(sortBy)
      .limit(limit)
      .skip(startIndex);

    return successResponse(res, 'Books fetched successfully', {
      books,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single book
export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'name email avatar phone address');

    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    return successResponse(res, 'Book fetched successfully', { book });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorResponse(res, 'Book not found', null, 404);
    }
    next(error);
  }
};

// Create book listing
export const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { title, author, isbn, genre, condition, description, price, discountPrice, stock } = req.body;

    const bookData = {
      title,
      author,
      isbn,
      genre,
      condition,
      description,
      price,
      discountPrice: discountPrice || null,
      stock,
      seller: req.user._id,
    };

    if (req.file && req.file.url) {
      bookData.coverImage = req.file.url;
    }

    const book = await Book.create(bookData);

    return successResponse(res, 'Book listing created successfully', { book }, 201);
  } catch (error) {
    // Delete uploaded image if book creation fails
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    next(error);
  }
};

// Update book
export const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    // Check ownership
    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this book', null, 403);
    }

    const { title, author, isbn, genre, condition, description, price, discountPrice, stock } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (isbn) updateData.isbn = isbn;
    if (genre) updateData.genre = genre;
    if (condition) updateData.condition = condition;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (stock !== undefined) updateData.stock = stock;

    if (req.file && req.file.url) {
      // Delete old image if exists
      if (book.coverImage) {
        const publicId = book.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`pageturn/book-covers/${publicId}`);
      }
      updateData.coverImage = req.file.url;
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Book updated successfully', { book });
  } catch (error) {
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    next(error);
  }
};

// Delete book
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    // Check ownership
    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this book', null, 403);
    }

    // Delete cover image if exists
    if (book.coverImage) {
      try {
        const publicId = book.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`pageturn/book-covers/${publicId}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Book.findByIdAndDelete(req.params.id);

    return successResponse(res, 'Book deleted successfully', {});
  } catch (error) {
    next(error);
  }
};

// Get my books (for logged-in seller)
export const getMyBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ seller: req.user._id });

    return successResponse(res, 'Your books fetched successfully', { books });
  } catch (error) {
    next(error);
  }
};

// Approve book listing (admin only)
export const approveBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 'Book not found', null, 404);
    }

    book.isApproved = true;
    await book.save();

    return successResponse(res, 'Book approved successfully', { book });
  } catch (error) {
    next(error);
  }
};

// Get pending books (admin only)
export const getPendingBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ isApproved: false }).populate('seller', 'name email');

    return successResponse(res, 'Pending books fetched successfully', { books });
  } catch (error) {
    next(error);
  }
};

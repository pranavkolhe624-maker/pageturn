import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'Please provide ISBN'],
  },
  genre: {
    type: String,
    enum: [
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Biography',
      'History',
      'Self-Help',
      'Educational',
      'Children',
      'Poetry',
      'Other',
    ],
    required: [true, 'Please select a genre'],
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Rare'],
    required: [true, 'Please select condition'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
  },
  coverImage: {
    type: String,
    default: null,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate effective price
bookSchema.methods.getEffectivePrice = function () {
  return this.discountPrice ? this.discountPrice : this.price;
};

export default mongoose.model('Book', bookSchema);

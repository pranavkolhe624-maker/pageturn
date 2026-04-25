import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { StarRating } from './StarRating';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const conditionBadge = (condition) => {
  if (condition === 'New') return 'badge-condition badge-new';
  if (condition === 'Rare') return 'badge-condition badge-rare';
  return 'badge-condition badge-used';
};

export const BookCard = ({ book, showPrice = true }) => {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(book);
    toast.success(`"${book.title}" added to cart!`, {
      icon: '📚',
      style: { borderRadius: '12px', fontWeight: '600' },
    });
    setTimeout(() => setAdding(false), 800);
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(w => !w);
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: wished ? '💔' : '❤️',
      style: { borderRadius: '12px' },
    });
  };

  return (
    <Link to={`/book/${book.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-gray-100">

        {/* ── Image ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50" style={{ height: '160px' }}>
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=📚';
            }}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick view on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/90 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
              <Eye className="w-3 h-3" /> View Details
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWish}
            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all duration-200 z-10 ${
              wished
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-gray-400 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-current' : ''}`} />
          </button>

          {/* Condition badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className={conditionBadge(book.condition)}>{book.condition}</span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">{book.genre}</p>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{book.author}</p>

          <div className="mb-3">
            <StarRating rating={book.rating} size="sm" />
          </div>

          <div className="mt-auto space-y-2">
            {showPrice && (
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                {book.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">₹{book.originalPrice}</span>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                adding
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200'
              }`}
              style={{ boxShadow: adding ? 'none' : '0 4px 12px rgba(99,102,241,0.3)' }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

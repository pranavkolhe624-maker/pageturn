import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Check, ArrowLeft, Star, BookOpen, User, Truck, Shield } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { BookGrid } from '../components/BookGrid';
import { useCart } from '../context/CartContext';
import { booksData } from '../data/books';
import toast from 'react-hot-toast';

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [wished, setWished] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const book = booksData.find(b => b.id === parseInt(id));
  const relatedBooks = booksData.filter(
    b => b.genre === book?.genre && b.id !== book?.id
  ).slice(0, 6);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">Book not found</p>
          <p className="text-gray-500 mb-6">This book may have been removed or doesn't exist.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart(book);
    toast.success(`"${book.title}" added to cart!`, {
      icon: '📚',
      style: { borderRadius: '12px', fontWeight: '600' },
    });
    setTimeout(() => setAddingToCart(false), 1000);
  };

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/checkout');
  };

  const reviews = [
    { author: 'Emma Smith', rating: 5, comment: 'Incredible book! A must-read for everyone. The storytelling is phenomenal.', date: '2024-03-15', avatar: 'ES' },
    { author: 'John Doe', rating: 4, comment: 'Really enjoyed this book. Highly recommended for all book lovers!', date: '2024-03-10', avatar: 'JD' },
    { author: 'Lisa Garcia', rating: 5, comment: 'Perfect condition when received. Great deal! The seller was very helpful.', date: '2024-03-05', avatar: 'LG' },
  ];

  const conditionColor = book.condition === 'New' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    book.condition === 'Rare' ? 'bg-purple-100 text-purple-700 border-purple-200' :
    'bg-blue-100 text-blue-700 border-blue-200';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)' }}>

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium line-clamp-1">{book.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-6 hover:gap-3 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Book Cover — properly sized */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-56 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '320px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450/6366f1/ffffff?text=📚';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${conditionColor}`}>
                    {book.condition}
                  </span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setWished(w => !w); toast.success(wished ? 'Removed from wishlist' : '❤️ Added to wishlist!'); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                    wished ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
                  {wished ? 'Saved' : 'Wishlist'}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* ── Book Info ── */}
            <div className="md:col-span-2 flex flex-col">
              <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-2">{book.genre}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {book.title}
              </h1>
              <p className="text-lg text-gray-500 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> by <span className="font-semibold text-gray-700">{book.author}</span>
              </p>

              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={book.rating} size="lg" />
                <span className="text-sm text-gray-500 font-medium">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Price</p>
                  <span className="text-4xl font-bold text-gray-900">₹{book.price}</span>
                </div>
                <div className="h-12 w-px bg-indigo-200" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Condition</p>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${conditionColor}`}>{book.condition}</span>
                </div>
                <div className="h-12 w-px bg-indigo-200" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Availability</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock
                  </p>
                </div>
              </div>

              {/* Book Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'ISBN', value: book.isbn },
                  { label: 'Publisher', value: book.publisher },
                  { label: 'Language', value: book.language },
                  { label: 'Pages', value: book.pages },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    addingToCart
                      ? 'bg-green-500 text-white scale-95'
                      : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addingToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
                {[
                  { icon: Shield, text: 'Secure Payment' },
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: Check, text: 'Easy Returns' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Icon className="w-3.5 h-3.5 text-indigo-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Seller Info ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Seller Information
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                {book.seller?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{book.seller}</p>
                <StarRating rating={4.8} size="sm" />
                <p className="text-xs text-gray-500 mt-0.5">2,345 total sales · 98% positive</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
            >
              Contact Seller
            </button>
          </div>
        </div>

        {/* ── About ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            About This Book
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {showFullDescription ? book.description : book.description?.substring(0, 250) + '...'}
          </p>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-3 text-indigo-600 font-semibold text-sm hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            {showFullDescription ? '▲ Read Less' : '▼ Read More'}
          </button>
        </div>

        {/* ── Reviews ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Customer Reviews
          </h3>
          <div className="space-y-5">
            {reviews.map((review, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-gray-800 text-sm">{review.author}</p>
                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <BookGrid books={relatedBooks} title="You May Also Like" />
        )}
      </div>
    </div>
  );
};

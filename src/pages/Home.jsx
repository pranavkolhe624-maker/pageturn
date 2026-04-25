import React, { useState } from 'react';
import { Search, ArrowRight, Star, BookOpen, TrendingUp, Users, Zap, ShoppingCart, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { booksData } from '../data/books';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Fiction', emoji: '🌟', bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
  { name: 'Mystery', emoji: '🔍', bg: '#f1f5f9', border: '#cbd5e1', text: '#334155' },
  { name: 'Romance', emoji: '💕', bg: '#fdf2f8', border: '#f9a8d4', text: '#9d174d' },
  { name: 'Science', emoji: '🔬', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  { name: 'History', emoji: '🏛️', bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  { name: 'Fantasy', emoji: '🐉', bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
];

const STATS = [
  { icon: BookOpen, label: 'Books Available', value: '10,000+', iconBg: '#eef2ff', iconColor: '#6366f1' },
  { icon: Users, label: 'Happy Readers', value: '50,000+', iconBg: '#fdf2f8', iconColor: '#ec4899' },
  { icon: Star, label: 'Average Rating', value: '4.8 ★', iconBg: '#fffbeb', iconColor: '#f59e0b' },
  { icon: Zap, label: 'Savings on Used', value: 'Up to 70%', iconBg: '#f0fdf4', iconColor: '#10b981' },
];

const TESTIMONIALS = [
  { name: 'Sarah Johnson', role: 'Book Blogger', avatar: 'SJ', avatarBg: '#eef2ff', avatarColor: '#6366f1', review: 'Found my favorite novel for ₹120! PageTurn is my go-to for affordable books.', rating: 5 },
  { name: 'Mike Chen', role: 'Literature Student', avatar: 'MC', avatarBg: '#eff6ff', avatarColor: '#3b82f6', review: 'Incredible selection and lightning-fast delivery. Used books in perfect condition!', rating: 5 },
  { name: 'Priya Patel', role: 'Teacher', avatar: 'PP', avatarBg: '#fdf2f8', avatarColor: '#ec4899', review: 'Sold 30+ books through PageTurn. Super smooth process and got paid instantly!', rating: 5 },
];

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const featuredBooks = booksData.slice(0, 10);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop${searchQuery ? `?q=${searchQuery}` : ''}`);
  };

  const handleAddToCart = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    toast.success(`Added to cart!`, { icon: '📚', style: { borderRadius: '12px', fontWeight: '600' } });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════
          HERO — clean white + purple gradient
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 pt-20 pb-32 px-4">
        {/* Subtle radial highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.1), transparent)' }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-semibold">India's #1 Book Marketplace · 50,000+ readers</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
          >
            Buy, Sell &<br />
            <span className="text-yellow-300">Discover Books</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Thousands of pre-loved &amp; new books at unbeatable prices.
            Find your next great read — delivered free to your door.
          </p>

          {/* ── Premium Search Bar ── */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden p-2 gap-2">
              <div className="flex items-center flex-1 px-3 gap-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, genre..."
                  className="flex-1 py-2 text-gray-800 placeholder-gray-400 text-base focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-700 bg-white text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
            >
              Explore Shop <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
            >
              Start Selling 💰
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M0,100 C480,30 960,80 1440,40 L1440,100 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED BOOKS
      ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-3">
                <Star className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600">Handpicked for You</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Featured Books</h2>
              <p className="text-gray-500 mt-1 text-sm">Curated bestsellers loved by our community</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredBooks.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="group block">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                  {/* Book cover */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50" style={{ height: '155px' }}>
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=📚'; }}
                    />
                    {/* Hover overlay with cart button */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <button
                        onClick={(e) => handleAddToCart(e, book)}
                        className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                    {/* Condition badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        book.condition === 'New' ? 'bg-emerald-500 text-white' :
                        book.condition === 'Rare' ? 'bg-purple-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {book.condition}
                      </span>
                    </div>
                  </div>

                  {/* Book info */}
                  <div className="p-3">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">{book.genre}</p>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2 truncate">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">₹{book.price}</span>
                      <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-700">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
            >
              Browse All 10,000+ Books <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-600">Browse by Genre</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Popular Categories</h2>
            <p className="text-gray-500 mt-2 text-sm">Find your next favorite in any genre</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, emoji, bg, border, text }) => (
              <Link key={name} to="/shop" className="group">
                <div
                  className="rounded-2xl p-6 text-center border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer"
                  style={{ backgroundColor: bg, borderColor: border }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 block">{emoji}</div>
                  <h3 className="font-bold text-sm" style={{ color: text }}>{name}</h3>
                  <p className="text-xs text-gray-400 mt-1">125+ books</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SELL CTA
      ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-5xl mb-5">💰</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Have Books to Sell?
              </h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of sellers earning extra income from unused books.
                List for free — get paid when they sell!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sell"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-700 bg-white text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
                >
                  Start Selling Today <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm border-2 border-white/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Browse Books First
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-full px-3 py-1 mb-3">
              <span className="text-xs font-bold text-pink-600">❤️ Community Love</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>What Readers Say</h2>
            <p className="text-gray-500 mt-2 text-sm">Trusted by thousands of book lovers across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: t.avatarBg, color: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

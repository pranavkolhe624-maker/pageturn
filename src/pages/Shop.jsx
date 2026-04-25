import React, { useState, useMemo } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { BookGrid } from '../components/BookGrid';
import { booksData } from '../data/books';
import { Search, SlidersHorizontal, X, BookOpen, ChevronDown } from 'lucide-react';

export const Shop = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    selectedGenres: [],
    minRating: 0,
    conditions: [],
  });

  const filteredAndSortedBooks = useMemo(() => {
    let result = booksData.filter(book => {
      const priceMatch = book.price >= filters.priceRange[0] && book.price <= filters.priceRange[1];
      const genreMatch = filters.selectedGenres.length === 0 || filters.selectedGenres.includes(book.genre);
      const ratingMatch = book.rating >= filters.minRating;
      const conditionMatch = filters.conditions.length === 0 || filters.conditions.includes(book.condition);
      const searchMatch = !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return priceMatch && genreMatch && ratingMatch && conditionMatch && searchMatch;
    });
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': default: result.sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [filters, sortBy, searchQuery]);

  const activeFilterCount =
    filters.selectedGenres.length +
    filters.conditions.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Title */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/80 text-xs font-semibold">Live inventory · {booksData.length} books</span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
                Browse Books
              </h1>
              <p className="text-indigo-200 text-sm mt-1">Free shipping · Secure payments · Easy returns</p>
            </div>

            {/* Premium Search Bar */}
            <div className="md:w-96">
              <div className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-center flex-1 px-4 gap-2">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8 md:h-10" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C480,0 960,30 1440,10 L1440,40 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-all relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-bold text-indigo-600">{filteredAndSortedBooks.length}</span>{' '}
              result{filteredAndSortedBooks.length !== 1 ? 's' : ''}
              {searchQuery && (
                <span className="text-gray-500"> for "<strong>{searchQuery}</strong>"</span>
              )}
            </p>
          </div>

          {/* Sort Dropdown - styled */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 hidden sm:block">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:border-indigo-400 cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <option value="newest">✨ Newest First</option>
                <option value="price-low">💰 Price: Low → High</option>
                <option value="price-high">💎 Price: High → Low</option>
                <option value="rating">⭐ Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            {filteredAndSortedBooks.length > 0 ? (
              <BookGrid books={filteredAndSortedBooks} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border-2 border-indigo-100">
                  <BookOpen className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No books found</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">
                  Try adjusting your filters or searching with different keywords.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ priceRange: [0, 500], selectedGenres: [], minRating: 0, conditions: [] });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

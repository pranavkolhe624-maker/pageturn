import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-[450px] flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-300 font-semibold">Discover & Share Books</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Buy. Sell.
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Discover Books.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of book lovers in our community. Buy pre-loved or new books, sell your collection, and discover your next favorite read at unbeatable prices.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-2">
              <div className="flex-1 flex items-center bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition-colors">
                <Search className="w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none ml-3 flex-1 text-white placeholder-gray-400 text-sm md:text-base"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop"
              className="bg-white hover:bg-gray-100 text-slate-900 font-semibold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/sell"
              className="border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Start Selling
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-2">10k+</div>
              <div className="text-sm text-gray-400">Books Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-2">50k+</div>
              <div className="text-sm text-gray-400">Happy Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-2">4.8★</div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


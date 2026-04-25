import React from 'react';
import { BookCard } from './BookCard';

export const BookGrid = ({ books, title, showPrice = true }) => {
  return (
    <div>
      {title && (
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {books.map((book, i) => (
          <div
            key={book.id}
            style={{ animationDelay: `${i * 0.05}s`, animation: 'fadeInUp 0.4s ease forwards', opacity: 0 }}
          >
            <BookCard book={book} showPrice={showPrice} />
          </div>
        ))}
      </div>
    </div>
  );
};

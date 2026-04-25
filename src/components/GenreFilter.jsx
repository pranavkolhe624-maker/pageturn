import React from 'react';
import { genres } from '../data/books';

export const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onGenreChange(null)}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
          selectedGenre === null
            ? 'bg-accent text-white'
            : 'bg-gray-200 text-primary hover:bg-gray-300'
        }`}
      >
        All Genres
      </button>
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
            selectedGenre === genre
              ? 'bg-accent text-white'
              : 'bg-gray-200 text-primary hover:bg-gray-300'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, size = 'md', count = null }) => {
  const stars = [];
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    const partial = i === Math.ceil(rating) && !Number.isInteger(rating);
    
    stars.push(
      <Star
        key={i}
        className={`${sizeMap[size]} ${
          filled || partial ? 'fill-accent text-accent' : 'text-gray-300'
        }`}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">{stars}</div>
      {count !== null && <span className="text-sm text-gray-600">({count})</span>}
      {!count && <span className="text-sm text-gray-600">{rating}</span>}
    </div>
  );
};

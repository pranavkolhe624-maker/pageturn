import React from 'react';
import { StarRating } from './StarRating';

export const TestimonialCard = ({ name, review, rating, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center gap-1 mb-3">
        <StarRating rating={rating} size="sm" />
      </div>
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{review}</p>
      <div className="flex items-center gap-3 border-t pt-4">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full bg-gray-300"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${name}`;
          }}
        />
        <div>
          <p className="font-semibold text-sm text-primary">{name}</p>
          <p className="text-xs text-gray-600">Verified Buyer</p>
        </div>
      </div>
    </div>
  );
};

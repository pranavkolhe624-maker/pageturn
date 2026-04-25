import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Tag, Star, BookMarked, Layers } from 'lucide-react';
import { StarRating } from './StarRating';
import { genres } from '../data/books';

const Section = ({ title, icon: Icon, expanded, onToggle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-4 py-3.5 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
    >
      <span className="flex items-center gap-2 text-sm">
        <span className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-indigo-600" />
        </span>
        {title}
      </span>
      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
    {expanded && <div className="px-4 pb-4 pt-1">{children}</div>}
  </div>
);

export const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [conditions, setConditions] = useState([]);
  const [expanded, setExpanded] = useState({ price: true, genre: true, rating: true, condition: true });

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const apply = (overrides) =>
    onFilterChange({ priceRange, selectedGenres, minRating, conditions, ...overrides });

  const handlePriceChange = (type, val) => {
    const r = [...priceRange];
    r[type === 'min' ? 0 : 1] = val;
    setPriceRange(r);
    apply({ priceRange: r });
  };

  const handleGenre = (genre) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    apply({ selectedGenres: updated });
  };

  const handleCondition = (cond) => {
    const updated = conditions.includes(cond)
      ? conditions.filter(c => c !== cond)
      : [...conditions, cond];
    setConditions(updated);
    apply({ conditions: updated });
  };

  const reset = () => {
    setPriceRange([0, 500]);
    setSelectedGenres([]);
    setMinRating(0);
    setConditions([]);
    onFilterChange({ priceRange: [0, 500], selectedGenres: [], minRating: 0, conditions: [] });
  };

  const hasFilters = selectedGenres.length > 0 || conditions.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Filters</h3>
        {hasFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <Section title="Price Range" icon={Tag} expanded={expanded.price} onToggle={() => toggle('price')}>
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">₹{priceRange[0]}</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">₹{priceRange[1]}</span>
          </div>
          <div className="space-y-3">
            <input type="range" min="0" max="500" value={priceRange[0]}
              onChange={(e) => handlePriceChange('min', +e.target.value)} className="w-full" />
            <input type="range" min="0" max="500" value={priceRange[1]}
              onChange={(e) => handlePriceChange('max', +e.target.value)} className="w-full" />
          </div>
        </div>
      </Section>

      {/* Genre */}
      <Section title="Genre" icon={BookMarked} expanded={expanded.genre} onToggle={() => toggle('genre')}>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {genres.map(genre => (
            <label key={genre} className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-colors text-sm ${
              selectedGenres.includes(genre) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenre(genre)}
                className="w-4 h-4 rounded"
              />
              {genre}
            </label>
          ))}
        </div>
      </Section>

      {/* Rating */}
      <Section title="Min Rating" icon={Star} expanded={expanded.rating} onToggle={() => toggle('rating')}>
        <div className="space-y-1.5">
          {[5, 4, 3, 2].map(r => (
            <label key={r} className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-colors text-sm ${
              minRating === r ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="rating"
                value={r}
                checked={minRating === r}
                onChange={() => { setMinRating(r); apply({ minRating: r }); }}
                className="w-4 h-4"
              />
              <StarRating rating={r} size="sm" />
              <span className="text-xs text-gray-500">& up</span>
            </label>
          ))}
          {minRating > 0 && (
            <button onClick={() => { setMinRating(0); apply({ minRating: 0 }); }}
              className="text-xs text-indigo-600 hover:underline mt-1 pl-2">
              Clear rating
            </button>
          )}
        </div>
      </Section>

      {/* Condition */}
      <Section title="Condition" icon={Layers} expanded={expanded.condition} onToggle={() => toggle('condition')}>
        <div className="space-y-1.5">
          {['New', 'Used', 'Rare'].map(cond => (
            <label key={cond} className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-colors text-sm ${
              conditions.includes(cond) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <input
                type="checkbox"
                checked={conditions.includes(cond)}
                onChange={() => handleCondition(cond)}
                className="w-4 h-4 rounded"
              />
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cond === 'New' ? 'bg-emerald-100 text-emerald-700' :
                cond === 'Rare' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>{cond}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Full reset button */}
      {hasFilters && (
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Filters
        </button>
      )}
    </div>
  );
};

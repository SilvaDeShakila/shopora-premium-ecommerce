import React from 'react';
import { FilterState, SortOption } from '../types';
import { X, RotateCcw } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  categories: string[];
  filterState: FilterState;
  maxCatalogPrice: number;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  categories,
  filterState,
  maxCatalogPrice,
  onUpdateFilter,
  onReset,
  onClose,
}) => {
  if (!isOpen) return null;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Alphabetical (A-Z)' },
    { value: 'rating-desc', label: 'Top Customer Rating' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Filter & Sort Products
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Max Price
              </label>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                Up to ${filterState.maxPrice.toFixed(0)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max={maxCatalogPrice || 1000}
              step="10"
              value={filterState.maxPrice}
              onChange={(e) => onUpdateFilter({ maxPrice: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$10</span>
              <span>${(maxCatalogPrice || 1000).toFixed(0)}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateFilter({ selectedCategory: null })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterState.selectedCategory === null
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onUpdateFilter({ selectedCategory: cat })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filterState.selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateFilter({ sortBy: opt.value })}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    filterState.sortBy === opt.value
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filterState.sortBy === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

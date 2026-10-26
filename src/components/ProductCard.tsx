import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, ShoppingCart, Star, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1200);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product);
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Image Area */}
      <div className="relative aspect-square w-full p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden">
        {imageError ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <ImageOff className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-[11px]">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all text-slate-500 hover:text-rose-500"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category kicker */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 truncate">
            {product.category}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Rating & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              ${product.price.toFixed(2)}
            </div>

            {product.rating && product.rating.rate > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {product.rating.rate.toFixed(1)}
                </span>
                <span>({product.rating.count})</span>
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            title="Add to Shopping Cart"
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              addedRecently
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Share2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  allProducts: Product[];
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  allProducts,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!product) return null;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header / Close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {product.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Link"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {copiedShare ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onToggleFavorite(product)}
              title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gallery Image Display */}
            <div className="aspect-square bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-8 flex items-center justify-center border border-slate-100 dark:border-slate-800/80">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Purchase Module */}
            <div className="flex flex-col">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {product.rating.rate}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {product.rating.count} authentic customer ratings
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums mb-6">
                ${product.price.toFixed(2)}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Product Overview
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Guarantee highlights */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>30-Day Easy Returns</span>
                </div>
              </div>

              {/* Quantity Stepper & CTA */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/80">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm tabular-nums text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Add to Bag · ${(product.price * quantity).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Related Products from same category */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-4">
                More in {product.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setQuantity(1);
                    }}
                    className="group cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="aspect-square w-full p-2 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center mb-2">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                      {rel.title}
                    </div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      ${rel.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

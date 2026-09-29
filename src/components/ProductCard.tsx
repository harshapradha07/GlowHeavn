import React from 'react';
import { Star, Heart, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  showPersonalizedScore?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
  showPersonalizedScore = true
}) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Visual Image Container - 65-75% height ratio */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="relative aspect-4/3 w-full bg-[#FBF9F8] overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Elegant CSS gradient fallback container
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('bg-gradient-to-tr', 'from-rose-50', 'to-stone-100');
            }
          }}
        />

        {/* Subtle Badge Tag - max 1 subtle text tag */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 hover:text-rose-600 hover:bg-white shadow-sm transition-all cursor-pointer"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Quick Add Overlay on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="w-full py-2.5 px-4 bg-stone-900/95 hover:bg-stone-900 text-white text-xs font-semibold tracking-wide rounded-xl shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-semibold text-rose-800 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-1 hover:text-rose-900 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>

          {/* Personalized Recommendation Match Indicator */}
          {showPersonalizedScore && product.matchScore && (
            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-rose-900">
              <span className="font-semibold font-mono tabular-nums bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded text-[11px]">
                {product.matchScore}% Match
              </span>
              <span className="text-[11px] text-stone-500 truncate">
                {product.matchReason}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Price & Rating Bar */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold font-mono tabular-nums">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

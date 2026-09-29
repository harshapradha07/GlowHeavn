import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Droplets, Leaf, Info } from 'lucide-react';
import { Product, UserPersona } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (product: Product, quantity: number, shade?: string, size?: string) => void;
  onBuyNow: (product: Product, shade?: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  currentUser: UserPersona | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToBag,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  currentUser
}) => {
  if (!isOpen || !product) return null;

  const [selectedShade, setSelectedShade] = useState<string>(
    product.shades && product.shades.length > 0 ? product.shades[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'howTo'>('overview');
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    onAddToBag(product, quantity, selectedShade || undefined, selectedSize || undefined);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleDirectBuy = () => {
    onBuyNow(product, selectedShade || undefined, selectedSize || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery Left */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F6] border border-stone-200/80">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {product.badge && (
                  <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
                    {product.badge}
                  </div>
                )}

                <button
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm transition-all cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-stone-700'}`}
                  />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="flex flex-col items-center gap-1">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Dermatologist Tested</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Droplets className="w-4 h-4 text-rose-700" />
                  <span>Cruelty-Free</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module Right */}
            <div className="flex flex-col space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span className="font-bold text-rose-800 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  {product.tagline}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-xs text-stone-800 font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono tabular-nums">{product.rating}</span>
                  </div>
                  <span className="text-xs text-stone-500">
                    Based on {product.reviewCount} verified reviews
                  </span>
                </div>
              </div>

              {/* Personalized Match Callout */}
              {currentUser && (
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-950">
                    <span className="font-bold">
                      {product.matchScore || 96}% Match for {currentUser.name.split(' ')[0]} ({currentUser.skinType} Skin)
                    </span>
                    <p className="text-rose-900/80 mt-0.5">
                      {product.matchReason || 'Matches your personal concerns and preferred radiant finish.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Price & Availability */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-stone-100">
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono tabular-nums text-stone-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock & Ready to Dispatch
                </span>
              </div>

              {/* Shade Selector if makeup */}
              {product.shades && product.shades.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-2">
                    <span>Selected Shade: <span className="text-rose-900 font-normal">{selectedShade}</span></span>
                    <span className="text-stone-400 font-normal">{product.shades.length} shades</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.shades.map((shade) => (
                      <button
                        key={shade.name}
                        onClick={() => setSelectedShade(shade.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                          selectedShade === shade.name 
                            ? 'border-stone-900 scale-110 shadow-sm' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: shade.hex }}
                        title={shade.name}
                      >
                        {selectedShade === shade.name && (
                          <span className="sr-only">Selected</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-2">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedSize === size
                            ? 'border-rose-900 bg-rose-50 text-rose-950 font-bold'
                            : 'border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Add to Bag + Buy Now */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-900 bg-white hover:bg-stone-50 text-stone-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedToast ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleDirectBuy}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>Buy Now with Express</span>
                </button>
              </div>

              {/* Product Info Tabs */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex gap-4 border-b border-stone-200 text-xs font-semibold pb-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`cursor-pointer transition-colors ${
                      activeTab === 'overview' ? 'text-rose-900 underline underline-offset-4' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`cursor-pointer transition-colors ${
                      activeTab === 'ingredients' ? 'text-rose-900 underline underline-offset-4' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Key Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab('howTo')}
                    className={`cursor-pointer transition-colors ${
                      activeTab === 'howTo' ? 'text-rose-900 underline underline-offset-4' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    How to Use
                  </button>
                </div>

                <div className="pt-3 text-xs text-stone-600 leading-relaxed min-h-[70px]">
                  {activeTab === 'overview' && (
                    <p>{product.description}</p>
                  )}
                  {activeTab === 'ingredients' && (
                    <div className="flex flex-wrap gap-1.5">
                      {product.keyIngredients.map((item, i) => (
                        <span key={i} className="text-stone-800 font-medium bg-stone-100 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  {activeTab === 'howTo' && (
                    <p>{product.howToUse}</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

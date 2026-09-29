import React from 'react';
import { X, Heart, Trash2, ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToBag: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToBag,
  onOpenDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F6] shadow-2xl flex flex-col border-l border-stone-200">
          
          <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Saved Favorites ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">No favorites saved yet</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Click the heart icon on any product to save it to your personal beauty wishlist.
                </p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white rounded-xl border border-stone-200/80 shadow-xs flex gap-3 group"
                >
                  <div 
                    onClick={() => {
                      onClose();
                      onOpenDetails(product);
                    }}
                    className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/70 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                          {product.brand}
                        </span>
                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="text-stone-400 hover:text-rose-700 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 
                        onClick={() => {
                          onClose();
                          onOpenDetails(product);
                        }}
                        className="text-xs font-semibold text-stone-900 truncate cursor-pointer hover:text-rose-900"
                      >
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold font-mono tabular-nums text-stone-900 mt-0.5">
                        ${product.price}
                      </div>
                    </div>

                    <button
                      onClick={() => onMoveToBag(product)}
                      className="mt-2 py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
